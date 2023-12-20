from rest_framework import serializers

from messenger.models import Conversation, Message
from django.contrib.auth.models import User


class ConversationSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ["id", "user1", "user2", "username", "created_timestamp"]
        read_only_fields = ["id", "created_timestamp"]

    def get_username(self, obj):
        return obj.user1.username


class SearchConversationSerializer(serializers.ModelSerializer):
    with_user = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ["id", "with_user", "created_timestamp"]
        read_only_fields = ["id", "created_timestamp"]

    def get_with_user(self, obj):
        request_user = self.context["request"].user
        return obj.user2.username if request_user == obj.user1 else obj.user1.username


class NewContactSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    with_user = serializers.CharField()


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "conversation", "user", "text", "created_timestamp"]
        read_only_fields = ["id", "created_timestamp"]
