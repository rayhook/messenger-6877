import factory
from django.contrib.auth.models import User
from .models import Conversation, Message


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model: User

    username = factory.sequence(lambda n: f"user{n}")
    email = factory.LazyAttribute(lambda o: f"{o.username}@example.com")
    password = factory.PostGenerationMethodCall("set_password", "password")


class ConversationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model: Conversation

    user1 = factory.SubFactory(UserFactory)
    user2 = factory.SubFactory(UserFactory)


class MessageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model: Message

    Conversation = factory.SubFactory(ConversationFactory)
    text = factory.Faker("sentence")
    user = factory.SubFactory(UserFactory)
