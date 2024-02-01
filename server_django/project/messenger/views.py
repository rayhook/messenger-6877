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
from messenger.models import Conversation, Message
from rest_framework_simplejwt.tokens import UntypedToken
from messenger.serializers import (
    ConversationSerializer,
    MessageSerializer,
    SearchConversationSerializer,
    NewContactSerializer,
)
import logging


from .logic.search_helpers import (
    search_conversations,
    search_new_contacts,
)
from .logic.poll_helpers import get_new_messages, get_new_conversations


JWT_authenticator = JWTAuthentication()

logger = logging.getLogger(__name__)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username", None)
        email = request.data.get("email")
        password = request.data.get("password")

        if not username or not password or not email:
            return Response(
                {"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST
            )
        user = User.objects.create_user(
            username=username, password=password, email=email
        )
        user.save()

        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED,
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
        refresh_token = request.data.get("refresh", None)

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
        conversations = Conversation.objects.filter(
            Q(user1=request.user) | Q(user2=request.user)
        )

        if not conversations.exists():
            return Response({"conversations": []}, status=status.HTTP_200_OK)

        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        query = request.data.get("query")
        new_contacts = []
        user2_username = request.data.get("user2")
        user2 = get_object_or_404(User, username=user2_username)

        user_ids = {"user1": request.user.id, "user2": user2.id}

        serializer = ConversationSerializer(data=user_ids)

        if serializer.is_valid():
            serializer.save()
            conversations = Conversation.objects.filter(
                Q(user1=user) | Q(user2=user)
            ).distinct()

            if conversations.exists():
                last_conversation = conversations.latest("id")
                last_conversation_id = last_conversation.id

            if query:
                conversations = search_conversations(query, user)
                new_contacts = search_new_contacts(query, conversations)

            search_conversation_serializer = SearchConversationSerializer(
                conversations, many=True, context={"request": request}
            )

            new_contact_serializer = NewContactSerializer(new_contacts, many=True)
            return Response(
                {
                    "conversations_list": search_conversation_serializer.data,
                    "new_contacts": new_contact_serializer.data,
                    "user_id": request.user.id,
                    "conversation_id": serializer.data["id"],
                    "last_conversation_id": last_conversation_id,
                },
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get("search", "")
        user = request.user
        new_contacts = []
        last_conversation_id = None
        conversations = Conversation.objects.filter(
            Q(user1=user) | Q(user2=user)
        ).distinct()
        if conversations.exists():
            last_conversation = conversations.latest("id")
            last_conversation_id = last_conversation.id
        if query:
            conversations = search_conversations(query, user)
            new_contacts = search_new_contacts(query, conversations)

        search_conversation_serializer = SearchConversationSerializer(
            conversations, many=True, context={"request": request}
        )

        new_contact_serializer = NewContactSerializer(new_contacts, many=True)

        return Response(
            {
                "username": user.username,
                "conversation_list": search_conversation_serializer.data,
                "new_contacts": new_contact_serializer.data,
                "last_conversation_id": last_conversation_id,
            },
            status=status.HTTP_200_OK,
        )


class MessageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        conversation_id = request.GET.get("conversationId")
        user_id = request.user.id
        if conversation_id is None:
            return Response(
                {"error": "No conversation Id provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        conversation = get_object_or_404(Conversation, id=conversation_id)
        messages_query_sorted = conversation.messages.all().order_by("id")

        if messages_query_sorted.exists():
            serializer = MessageSerializer(messages_query_sorted, many=True)
            serializer_data = serializer.data
            last_message_id = messages_query_sorted.last().id
        else:
            serializer_data = []
            last_message_id = None

        return Response(
            {
                "user_id": user_id,
                "messages": serializer_data,
                "last_message_id": last_message_id,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        conversation_id = request.data.get("conversation")
        text = request.data.get("text")

        if conversation_id is None:
            return Response(
                {"error": "No conversation Id provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if text is None:
            return Response(
                {"error": "No text provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        conversation = Conversation.objects.get(id=conversation_id)

        try:
            Message.objects.create(
                conversation=conversation, text=text, user=request.user
            )

            messages = conversation.messages.all()
            if messages.exists():
                return Response(
                    {
                        "messages": list(messages.values()),
                        "last_message_id": messages.last().id,
                    },
                    status=status.HTTP_201_CREATED,
                )
        except Exception as e:
            return Response(
                {"error": "An unexpected error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class PollMessagesView(APIView):
    def get(self, request):
        user = request.user
        conversation_id = request.GET.get("conversationId")
        last_message_id = request.GET.get("lastMessageId")
        last_conversation_id = request.GET.get("lastConversationId")

        new_conversation_sorted_queryset, last_conversation_id = get_new_conversations(
            user, last_conversation_id
        )
        new_conversations = SearchConversationSerializer(
            new_conversation_sorted_queryset, many=True, context={"request": request}
        )

        if conversation_id:
            new_messages_sorted_queryset, last_message_id = get_new_messages(
                conversation_id, last_message_id
            )
            new_messages_serlizer = MessageSerializer(
                new_messages_sorted_queryset, many=True
            )
            new_messages = new_messages_serlizer.data
        else:
            new_messages = []
            last_message_id = None

        return Response(
            {
                "new_conversations": new_conversations.data,
                "last_conversation_id": last_conversation_id,
                "new_messages": new_messages,
                "last_message_id": last_message_id,
            },
            status=status.HTTP_200_OK,
        )
