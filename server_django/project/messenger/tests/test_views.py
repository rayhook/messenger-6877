from django.test import TestCase, Client
from rest_framework.test import APIClient
from django.urls import reverse
from messenger.tests.factories import UserFactory, ConversationFactory, MessageFactory
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth.models import User


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

    def get_access_token(self):
        response = self.client.post(
            reverse("login"),
            {"username": self.username, "password": self.password},
        )

        return response.json()["access"]

    def test_conversation_is_empty(self):
        token = self.get_access_token()

        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + token)

        response = self.client.get(reverse("conversations"))

        self.assertEqual(response.status_code, 200)