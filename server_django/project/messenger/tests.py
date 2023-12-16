from django.test import TestCase

from .factories import ConversationFactory, MessageFactory


class TestModels(TestCase):
    def test_message_creation(self):
        conversation = ConversationFactory()

        message = MessageFactory

        # assertion
        self.assertIsNotNone(message.id)
        self.assertEqual(message.conversation, conversation)
        self.assertTrue(message.text)
