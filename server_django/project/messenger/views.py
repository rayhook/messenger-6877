from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth import authenticate
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from messenger.models import Conversation, UserProfile, Message
from rest_framework_simplejwt.tokens import UntypedToken
import logging

from .utils.user_helpers import get_user_profile
from .utils.conversation_helpers import (
    get_conversations,
    format_conversation_with_username,
)
from .utils.search_helpers import (
    search_conversations,
    search_new_contacts,
    format_conversation_list,
)
from .utils.message_helpers import get_last_message_id


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
        user_profile = get_user_profile(user)
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "userId": user_profile.id,
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


class ValidateTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")
        try:
            UntypedToken(token)
            return Response({"isValid": True}, status=status.HTTP_200_OK)
        except (InvalidToken, TokenError):
            return Response({"isValid": False}, status=status.HTTP_200_OK)


class ConversationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_profile = request.user.userprofile
            conversations = get_conversations(user_profile)
            conversation_with_username = format_conversation_with_username(
                conversations
            )
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "UserProfile doesnt exist"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Conversation.DoesNotExist:
            return Response(
                {"error": "No conversations found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(
            {"conversations": conversation_with_username}, status=status.HTTP_200_OK
        )

    def post(self, request):
        other_user_username = request.data.get("otherUser")
        other_user = get_object_or_404(User, username=other_user_username)
        other_user_user_profile = get_object_or_404(UserProfile, user=other_user)
        user_profile = get_user_profile(request.user)
        try:
            conversation = Conversation.objects.create(
                user=user_profile, other_user=other_user_user_profile
            )
            return Response(
                {
                    "user_id": user_profile.id,
                    "conversation_id": conversation.id,
                },
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            return Response(
                {"error": "an error occured while creating the conversation"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class SearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get("search", "")
        current_user_profile = get_user_profile(request.user)
        new_contacts = []
        if query:
            conversations = search_conversations(query, current_user_profile)
            new_contacts = search_new_contacts(query, conversations)
        else:
            conversations = Conversation.objects.filter(
                Q(user=current_user_profile) | Q(other_user=current_user_profile)
            ).distinct()

        conversation_list = format_conversation_list(
            conversations, current_user_profile
        )
        return Response(
            {"conversation_list": conversation_list, "new_contacts": new_contacts},
            status=status.HTTP_200_OK,
        )


class MessageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        conversation_id = request.GET.get("conversationId")
        if conversation_id is not None:
            messages = Message.objects.filter(conversation_id=conversation_id).order_by(
                "id"
            )
            if messages.exists():
                return Response(
                    {
                        "user_id": get_user_profile(request.user).id,
                        "messages": list(messages.values()),
                        "last_message_id": get_last_message_id(messages),
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "user_id": get_user_profile(request.user).id,
                        "messages": [],
                        "last_message_id": None,
                    },
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {"error": "No conversation Id provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def post(self, request):
        conversation_id = request.data.get("conversation")
        text = request.data.get("text")
        user_profile = get_user_profile(request.user)

        conversation = Conversation.objects.get(id=conversation_id)

        try:
            Message.objects.create(
                conversation=conversation, text=text, user=user_profile
            )
            messages = Message.objects.filter(conversation_id=conversation_id)
            if messages.exists():
                return Response(
                    {
                        "messages": list(messages.values()),
                        "last_message_id": get_last_message_id(messages),
                    },
                    status=status.HTTP_201_CREATED,
                )
        except Exception as e:
            return Response(
                {"error": "An unexpected error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CheckNewMessagesView(APIView):
    def get(self, request):
        conversation_id = request.GET.get("conversationId")
        last_message_id = request.GET.get("lastMessageId")

        if conversation_id is None:
            return Response(
                {"error": "Missing conversationId or lastMessageId"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if conversation_id is not None and last_message_id is None:
            return Response(
                {"new_messages": [], "last_message_id": None}, status=status.HTTP_200_OK
            )

        try:
            conversation_id = int(conversation_id)
            last_message_id = int(last_message_id)
            new_messages = Message.objects.filter(
                conversation_id=conversation_id,
                id__gt=last_message_id,
            ).order_by("id")

            if new_messages.exists():
                last_message_id = new_messages.last().id
                return Response(
                    {
                        "new_messages": list(new_messages.values()),
                        "last_message_id": get_last_message_id(new_messages),
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