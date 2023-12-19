from django.test import TestCase
from django.contrib.auth.models import User
from messenger.tests.factories import UserFactory, ConversationFactory, MessageFactory
from messenger.models import Conversation, Message


class TestModels(TestCase):
    def test_user_creation(self):
        username1 = "foo"
        user = UserFactory(username=username1)

        # assertions
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(user.username, username1)
        self.assertEqual(user.email, f"{username1}@example.com")

    def test_conversation_creation(self):
        username1 = "foo"
        username2 = "bar"
        user1 = UserFactory(username=username1)
        user2 = UserFactory(username=username2)

        conversation = ConversationFactory(user1=user1, user2=user2)

        # assertions
        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(conversation.user1, user1)
        self.assertEqual(Conversation.objects.first().id, 1)

    def test_message_creation(self):
        conversation = ConversationFactory()
        message = MessageFactory(conversation=conversation)

        # assertions
        self.assertEqual(Message.objects.count(), 1)
        self.assertTrue(Message.objects.first().text)
        self.assertIsInstance(message, Message)
