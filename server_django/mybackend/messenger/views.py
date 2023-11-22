from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import NotFound
from django.db.models import Q

from messenger.models import Conversations, UserProfile, Messages
import logging


JWT_authenticator = JWTAuthentication()

logger = logging.getLogger(__name__)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if not username or not password or not email:
            return Response(
                {"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST
            )
        user = User.objects.create_user(
            username=username, password=password, email=email
        )

        logger.info("User {username} created successfully!")

        user_profile = UserProfile(user=user)
        user_profile.save()

        return Response(
            {"message": "User registered successfully"}, status=status.HTTP_201_CREATED
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user is None:
            return Response(
                {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "userId": user.id,
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data["refresh"]

        if refresh_token is None:
            return Response(
                {"error": "Refresh token is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()

        except TokenError:
            return Response(
                {"error": "Token is invalid or expired"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"message": "Logged out successfully"}, status=status.HTTP_200_OK
        )


class UsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            users_list = User.objects.all()
            users_list_password_removed = []
            for user in users_list:
                users_list_password_removed.append(
                    {"id": user.id, "username": user.username, "email": user.email}
                )
            return Response(
                {"users": users_list_password_removed}, status=status.HTTP_200_OK
            )
        except:
            return Response(
                {"error": "failed to get users_list"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ConversationCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        other_user_username = request.data.get("otherUser")
        user = get_object_or_404(User, username=other_user_username)
        other_user_user_profile = get_object_or_404(UserProfile, user=user)
        try:
            conversation = Conversations.objects.create(
                user=request.user.userprofile, other_user=other_user_user_profile
            )
            return Response(
                {"conversation_id": conversation.id}, status=status.HTTP_201_CREATED
            )
        except Exception as e:
            logger.error(f"Error creating a conversation: {e}")
            return Response(
                {"error": "an error occured while creating the conversation"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class SearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search_query = request.query_params.get("search", "")
        current_user_profile = request.user.userprofile
        conversations, new_contacts, new_contact_list = [], [], []

        if search_query:
            # all users that their username contains the search query
            users = UserProfile.objects.filter(user__username__icontains=search_query)
            # conversations between current user and in users (users are filtered to contain search query)
            conversations = Conversations.objects.filter(
                Q(user=current_user_profile, other_user__in=users)
                | Q(other_user=current_user_profile, user__in=users)
            ).distinct()
            existing_contact_ids = [c.user.id for c in conversations] + [
                c.other_user.id for c in conversations
            ]

            new_contacts = UserProfile.objects.exclude(
                id__in=existing_contact_ids
            ).filter(user__username__icontains=search_query)

            new_contact_list = [
                {"id": contact.id, "with_user": contact.user.username}
                for contact in new_contacts
            ]

        else:
            conversations = Conversations.objects.filter(
                Q(user=current_user_profile) | Q(other_user=current_user_profile)
            ).distinct()

        conversation_list = [
            {
                "id": conversation.id,
                "with_user": conversation.other_user.user.username
                if conversation.user == current_user_profile
                else conversation.user.user.username,
                "timestamp": conversation.timestamp,
            }
            for conversation in conversations
        ]

        return Response(
            {"conversation_list": conversation_list, "new_contacts": new_contact_list},
            status=status.HTTP_200_OK,
        )


class ConversationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            current_user_profile = UserProfile.objects.get(user=request.user)
            conversations = Conversations.objects.filter(
                user=current_user_profile
            ).prefetch_related("user__user")
            conversation_with_username = []
            for convo in conversations:
                conversation_with_username.append(
                    {
                        "id": convo.id,
                        "user_id": convo.user.user.id,
                        "username": convo.user.user.username,
                        "timestamp": convo.timestamp,
                    }
                )
        except UserProfile.DoesNotExist:
            logging.error(f"UserProfile doesnt not exist: {request.user}")
            return Response(
                {"error": "UserProfile doesnt exist"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Conversations.DoesNotExist:
            logging.error(
                f"No conversations found for user profile: {current_user_profile}"
            )
            return Response(
                {"error": "No conversations found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(
            {"conversations": conversation_with_username}, status=status.HTTP_200_OK
        )


class MessageCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        conversation_id = request.data.get("conversation")
        text = request.data.get("text")
        user_profile = request.user.userprofile

        conversation = Conversations.objects.get(id=conversation_id)

        try:
            Messages.objects.create(
                conversation=conversation, text=text, user=user_profile
            )
            messages = Messages.objects.filter(conversation_id=conversation_id)
            if messages.exists():
                last_message_id = messages.last().id
                return Response(
                    {
                        "messages": list(messages.values()),
                        "last_message_id": last_message_id,
                    },
                    status=status.HTTP_201_CREATED,
                )
        except Exception as e:
            logger.error(f"Error creating Message: {e}")
            return Response(
                {"error": "An unexpected error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class Message(APIView):
    def get(self, request):
        conversation_id = request.GET.get("conversationId")
        if conversation_id is not None:
            messages = Messages.objects.filter(
                conversation_id=conversation_id
            ).order_by("id")
            if messages.exists():
                last_message_id = messages.last().id
                return Response(
                    {
                        "messages": list(messages.values()),
                        "last_message_id": last_message_id,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"messages": [], "last_message_id": None},
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {"error": "No conversation Id provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class NewMessage(APIView):
    def get(self, request):
        conversation_id = request.GET.get("conversationId")
        last_message_id = request.GET.get("lastMessageId")

        if conversation_id is None or last_message_id is None:
            return Response(
                {"error": "Missing conversationId or lastMessageId"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            conversation_id = int(conversation_id)
            last_message_id = int(last_message_id)
            new_messages = Messages.objects.filter(
                conversation_id=conversation_id,
                id__gt=last_message_id,
            ).order_by("id")

            if new_messages.exists():
                last_message_id = new_messages.last().id
                return Response(
                    {
                        "new_messages": list(new_messages.values()),
                        "last_message_id": last_message_id,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"new_messages": [], "last_message_id": last_message_id},
                    status=status.HTTP_200_OK,
                )

        except ValueError:
            return Response(
                {"error": "Invalid last message_Id or conversation_id"},
                status=status.HTTP_400_BAD_REQUEST,
            )
