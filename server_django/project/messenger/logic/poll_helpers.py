from messenger.models import Message, Conversation
from django.shortcuts import get_object_or_404
from django.db.models import Q
from messenger.serializers import MessageSerializer, ConversationSerializer
from rest_framework.response import Response
from rest_framework import status


def get_new_conversations(user, last_conversation_id):
    # if no last conversation is passed, return all conversations
    last_conversation_id = int(last_conversation_id) if last_conversation_id else 0

    new_conversation_sorted_queryset = (
        Conversation.objects.filter(
            Q(user1=user) | Q(user2=user), id__gt=last_conversation_id
        )
        .distinct()
        .order_by("id")
    )
    new_conversation_sorted_serializer = ConversationSerializer(
        new_conversation_sorted_queryset, many=True
    )
    if new_conversation_sorted_queryset.exists():
        last_conversation_id = new_conversation_sorted_queryset.last().id

    return new_conversation_sorted_serializer.data, last_conversation_id


def get_new_messages(conversation_id, last_message_id):
    # function should always receive conversation_id
    try:
        conversation_id = int(conversation_id)
    except ValueError:
        return Response(
            {"error": "Invalid conversation_id"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    conversation = get_object_or_404(Conversation, id=conversation_id)
    conversation_id = int(conversation_id)

    last_message_id = int(last_message_id) if last_message_id else 0

    new_messages_sorted = conversation.messages.filter(
        conversation=conversation, id__gt=last_message_id
    ).order_by("id")

    new_messages_sorted_serializer = MessageSerializer(new_messages_sorted, many=True)
    if new_messages_sorted.exists():
        last_message_id = new_messages_sorted.last().id
    return new_messages_sorted_serializer.data, last_message_id
