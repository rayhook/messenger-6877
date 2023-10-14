from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse, JsonResponse
from django.views import View
from django.shortcuts import render
from rest_framework_simplejwt.tokens import BlacklistedToken
from rest_framework_simplejwt.exceptions import TokenError

from messenger.models import Conversations, UserProfile
import logging
from rest_framework.permissions import AllowAny

logger = logging.getLogger(__name__)


def Homepage(request):
    return HttpResponse("Welcome to the messenger app homepage")


class ConversationsView(View):
    def get(self, request):
        # get or create conversation(request.user)
        # convo history = Messages.objects.filter(conversation = conversation)
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
