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


from messenger.models import Conversations, UserProfile
import logging


JWT_authenticator = JWTAuthentication()

logger = logging.getLogger(__name__)


def Homepage(request):
    return HttpResponse("Welcome to the messenger app homepage")


class ConversationsView(View):
    def get(self, request):
        conversations = Conversations.objects.all()
        response = {"conversations": list(conversations.values())}
        return JsonResponse(response)


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
            print("users_list ", users_list)
            return Response(
                {"users": list(users_list.values())}, status=status.HTTP_200_OK
            )
        except:
            return Response(
                {"error": "failed to get users_list"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ConversationCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            conversation = Conversations.objects.create(user=user_profile)
            return Response(
                {"conversation_id": conversation.id}, status=status.HTTP_201_CREATED
            )
        except Exception as e:
            logging.error(f"Error creating conversation: {e}")
            return Response(
                {"error": "failed to get conversation_id"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
