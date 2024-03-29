import factory
from django.test import TestCase, Client
from rest_framework.test import APIClient, force_authenticate
from django.urls import reverse
from messenger.tests.factories import UserFactory, ConversationFactory, MessageFactory
from rest_framework_simplejwt.tokens import RefreshToken

from messenger.serializers import (
    ConversationSerializer,
    MessageSerializer,
    SearchConversationSerializer,
    NewContactSerializer,
)


class TestRegisterView(TestCase):
    def setUp(self):
        self.client = Client()

    def test_register_params(self):
        response = self.client.post(
            reverse("register"),
            {
                "username": "username",
                "password": "password",
                "email": "email@example.com",
            },
        )

        self.assertEqual(response.status_code, 201)

        data = response.json()

        self.assertEqual(data.get("message"), "User registered successfully")

    def test_register_unknown_params(self):
        response = self.client.post(
            reverse("register"),
            {
                "username": "",
                "password": "password",
                "email": "email",
            },
        )
        self.assertEqual(response.status_code, 400)


class TestLoginView(TestCase):
    def setUp(self):
        self.client = Client()
        username = "username"
        self.test_user = UserFactory(username=username)

    def test_login_no_username(self):
        response = self.client.post(reverse("login"), {"username": ""})

        self.assertEqual(response.status_code, 401)

    def test_login(self):
        response = self.client.post(
            reverse("login"), {"username": "username", "password": "password"}
        )

        self.assertEqual(response.status_code, 200)


class TestLogoutView(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = UserFactory(username="username", password="password")
        self.refresh_token = RefreshToken.for_user(self.user)

    def test_logout_no_refresh(self):
        response = self.client.post(reverse("logout"))
        self.assertEqual(response.status_code, 400)

        data = response.json()
        self.assertEqual(data.get("error"), "Refresh token is required")

    def test_logout_invalid_token(self):
        response = self.client.post(reverse("logout"), {"refresh": ""})
        self.assertEqual(response.status_code, 400)

        data = response.json()
        self.assertEqual(data.get("error"), "Token is invalid or expired")

    def test_refresh_with_valid_token(self):
        response = self.client.post(
            reverse("logout"), {"refresh": str(self.refresh_token)}
        )
        self.assertEqual(response.status_code, 200)

        data = response.json()

        self.assertEqual(data.get("message"), "Logged out successfully")


class TestValidateTokenView(TestCase):
    def setUp(self):
        self.client = Client()
        username = "username"
        password = "password"
        self.user = UserFactory(username=username, password=password)
        self.refresh_token = RefreshToken.for_user(self.user)

    def test_invalid_token(self):
        response = self.client.post(
            reverse("token_validate"), {"token": "invalid token"}
        )
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data.get("isValid"), False)

    def test_valid_token(self):
        response = self.client.post(
            reverse("token_validate"), {"token": str(self.refresh_token)}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("isValid"), True)


class TestConversationView(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.username = "user3"
        self.password = "123456"
        self.user = UserFactory(username=self.username, password=self.password)
        self.authenticate_with_access_token()

    def authenticate_with_access_token(self):
        response = self.client.post(
            reverse("login"),
            {"username": self.username, "password": self.password},
        )

        token = response.json()["access"]
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + token)

    def test_authenticate_with_token(self):
        response = self.client.get(reverse("conversations"))

        self.assertEqual(response.status_code, 200)

    def test_user_with_no_conversations(self):
        response = self.client.get(reverse("conversations"))

        data = response.json()

        self.assertEqual(data.get("conversations"), [])

    def test_conversations_exist(self):
        user1 = self.user
        user2 = UserFactory()
        conversation = ConversationFactory(user1=user1, user2=user2)

        response = self.client.get(reverse("conversations"))
        data = response.json()

        serialzer = ConversationSerializer(instance=conversation)
        serialzer_data = serialzer.data

        self.assertTrue(data, serialzer_data)

    def test_create_conversation(self):
        self.user1 = self.user
        self.user2 = UserFactory()

        request_data = {"user2": self.user2.username, "query": ""}
        response = self.client.post(reverse("conversations"), request_data)
        data = response.json()
        self.assertEqual(response.status_code, 201)

        conversation_list = data.get("conversations_list")

        conversation_exists = any(
            conv.get("with_user") == self.user2.username for conv in conversation_list
        )
        self.assertTrue(conversation_exists)
        self.assertEqual(data.get("last_conversation_id"), conversation_list[0]["id"])


class TestSearchView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = UserFactory()

        self.client.force_authenticate(user=self.user)

    def test_search_users(self):
        request_data = {"search": ""}

        response = self.client.get(reverse("search"), request_data)

        self.assertEqual(response.status_code, 200)

    def test_search_new_contacts(self):
        self.user1 = UserFactory(username="mary")
        self.user2 = UserFactory(username="matt")
        self.user3 = UserFactory(username="sean")

        request_data = {"search": "m"}
        response = self.client.get(reverse("search"), request_data)
        data = response.json()

        new_contacts = data.get("new_contacts")

        # filteres new_contacts correctly
        new_contacts_usernames = [contact["with_user"] for contact in new_contacts]
        self.assertIn(self.user1.username, new_contacts_usernames)
        self.assertIn(self.user2.username, new_contacts_usernames)
        self.assertTrue(self.user3.username not in new_contacts_usernames)

    def test_search_conversations(self):
        self.user1 = UserFactory(username="mary")
        self.user2 = UserFactory(username="matt")
        self.user3 = UserFactory(username="sean")

        ConversationFactory(user1=self.user1, user2=self.user)
        ConversationFactory(user1=self.user2, user2=self.user)
        ConversationFactory(user1=self.user3, user2=self.user)

        request_data = {"search": "m"}
        response = self.client.get(reverse("search"), request_data)
        data = response.json()

        conversation_list = data.get("conversation_list")
        conversation_list_usernames = [
            convo["with_user"] for convo in conversation_list
        ]
        self.assertIn(self.user1.username, conversation_list_usernames)
        self.assertIn(self.user3.username, conversation_list_usernames)

    def test_last_conversation_id(self):
        self.user1 = UserFactory(username="mary")
        self.user2 = UserFactory(username="matt")
        self.user3 = UserFactory(username="sean")

        ConversationFactory(user1=self.user1, user2=self.user)
        ConversationFactory(user1=self.user2, user2=self.user)
        conversation_3 = ConversationFactory(user1=self.user3, user2=self.user)

        response = self.client.get(reverse("search"))
        data = response.json()

        last_conversation_id = data.get("last_conversation_id")
        self.assertEqual(last_conversation_id, conversation_3.id)


class MessageViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.user2 = UserFactory()
        self.client.force_authenticate(self.user)

    def test_missing_conversation_id(self):
        response = self.client.get(reverse("messages"))
        self.assertEqual(response.status_code, 400)

    def test_incorrect_conversation_id(self):
        response = self.client.get(reverse("messages"), {"conversationId": "12"})
        self.assertEqual(response.status_code, 404)

    def test_get_messages_in_conversation(self):
        self.conversation = ConversationFactory(user1=self.user, user2=self.user2)
        self.text1 = "how are you today?"

        self.message = MessageFactory(
            conversation=self.conversation, user=self.user, text=self.text1
        )

        response = self.client.get(
            reverse("messages"), {"conversationId": self.conversation.id}
        )

        data = response.json()
        messages = data.get("messages")
        messages_text = [message["text"] for message in messages]

        self.assertEqual(response.status_code, 200)
        self.assertIn(
            self.text1,
            messages_text,
        )
        self.assertEqual(data.get("user_id"), self.user.id)

    def test_create_messages_missing_params(self):
        response = self.client.post(reverse("messages"))
        data = response.json()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get("error"), "No conversation Id provided")

    def test_create_messages(self):
        self.conversation = ConversationFactory(user1=self.user, user2=self.user2)
        self.text = "good morning"
        request_data = {"conversation": self.conversation.id, "text": self.text}

        response = self.client.post(reverse("messages"), request_data)

        data = response.json()
        messages = data.get("messages")
        messages_texts = [message["text"] for message in messages]

        self.assertEqual(response.status_code, 201)
        self.assertIn(self.text, messages_texts)
        last_message_id = data.get("last_message_id")
        self.assertEqual(last_message_id, messages[-1]["id"])


class TestPollMessagesView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(self.user)

    def test_poll_new_messages(self):
        self.user2 = UserFactory()
        self.user3 = UserFactory()
        self.conversation1 = ConversationFactory(user1=self.user, user2=self.user2)
        self.conversation2 = ConversationFactory(user1=self.user, user2=self.user2)
        self.text1 = "Hi"
        self.text2 = "How are you?"
        self.message1 = MessageFactory(
            conversation=self.conversation1, user=self.user, text=self.text1
        )
        self.message2 = MessageFactory(
            conversation=self.conversation1, user=self.user, text=self.text2
        )

        request_data = {
            "conversationId": self.conversation1.id,
            "lastMessageId": self.message1.id,
            "lastConversationId": self.conversation1.id,
        }
        response = self.client.get(reverse("check_new_messages"), request_data)
        data = response.json()
        last_conversation_id = data.get("last_conversation_id")
        new_messages = data.get("new_messages")

        new_message_texts = [msg["text"] for msg in new_messages]

        self.assertEqual(last_conversation_id, self.conversation2.id)
        self.assertEqual(response.status_code, 200)
        self.assertIn(self.message2.text, new_message_texts)
