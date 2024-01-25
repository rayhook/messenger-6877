from django.test import TestCase, Client
from django.urls import reverse
from messenger.tests.factories import UserFactory, ConversationFactory, MessageFactory
from rest_framework_simplejwt.tokens import RefreshToken


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
