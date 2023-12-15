from rest_framework import serializers

from messenger.models import Conversation, Message


class ConversationSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ["id", "user1", "user2", "username", "created_timestamp"]
        read_only_fields = ["id", "created_timestamp"]

    def get_username(self, obj):
        return obj.user1.username


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "conversation", "user", "text", "created_timestamp"]
        read_only_fields = ["id", "created_timestamp"]
