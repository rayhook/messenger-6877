from messenger.models import Conversation


def get_conversations(user):
    return Conversation.objects.filter(user1=user)


def format_conversation_with_username(conversations):
    conversation_with_username = []
    for conversation in conversations:
        conversation_with_username.append(
            {
                "id": conversation.id,
                "user_id": conversation.user1.id,
                "username": conversation.user1.username,
                "timestamp": conversation.timestamp,
            }
        )
    return conversation_with_username
