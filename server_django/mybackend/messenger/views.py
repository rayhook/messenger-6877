from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse, JsonResponse
from django.views import View
from django.shortcuts import render
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import Http404


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
            users_list_cleaned = []
            for user in users_list:
                users_list_cleaned.append(
                    {"id": user.id, "username": user.username, "email": user.email}
                )
            return Response({"users": users_list_cleaned}, status=status.HTTP_200_OK)
        except:
            return Response(
                {"error": "failed to get users_list"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ConversationCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            other_user_id = request.data.get("userId")
            logging.info(f"other_user_id? {other_user_id}")
            other_user = User.objects.get(id=other_user_id)
            logging.info(f"other_user? {other_user }")
            other_user_profile = UserProfile.objects.get(user=other_user)
            logging.info(f"other_user_profile? {other_user_profile}")
            user_profile = UserProfile.objects.get(user=request.user)
            logging.info(f"user_profile? {other_user_id}")
            conversation = Conversations.objects.create(
                user=user_profile, other_user=other_user_profile
            )
            conversations = Conversations.objects.filter(user=user_profile)
            logging.info(f"conversations? {list(Conversations.values())}")

            return Response(
                {
                    "conversations": list(conversations.values()),
                    "conversation_id": conversation.id,
                },
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            logging.error(f"Error creating conversation: {e}")
            return Response(
                {"error": "failed to get conversation_id"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
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
        logger.info(f"MessageCreateView/request.data {request.data}")

        username = request.data.get("username")
        conversation_id = request.data.get("conversation")
        text = request.data.get("text")
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse(
                {"error": "User with given username does not exist."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            user_profile = UserProfile.objects.get(user=user)
        except User.DoesNotExist:
            return JsonResponse(
                {"error": "UserProfile with given username does not exist."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            conversation = Conversations.objects.get(id=conversation_id)
        except Conversations.DoesNotExist:
            return JsonResponse(
                {"error": "Conversation with given ID does not exist."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            Messages.objects.create(
                conversation=conversation, text=text, user=user_profile
            )
            messages = Messages.objects.filter(conversation_id=conversation_id)
            return JsonResponse(
                {"messages": list(messages.values())}, status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Error creating Message: {e}")
            return JsonResponse(
                {"error": "An unexpected error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# class MessageList(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         conversation_id = request.data.get("conversationId")
#         messages = Messages.objects.filter(conversation_id=conversation_id)
#         try:
#             return Response(
#                 {"messages": list(messages.values())}, status=status.HTTP_200_OK
#             )
#         except Exception as e:
#             logger.error(f"Error listing messages {e}")
#             return Response(
#                 {"error": "error creating a list"},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             )
