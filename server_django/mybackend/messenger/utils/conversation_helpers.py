from messenger.models import Conversations


def get_conversations(user_profile):
    return Conversations.objects.filter(user=user_profile).prefetch_related(
        "user__user"
    )


def format_conversation_with_username(conversations):
    conversation_with_username = []
    for convo in conversations:
        conversation_with_username.append(
            {
                "id": convo.id,
                "user_id": convo.user.user.id,
                "username": convo.user.user.username,
                "timestamp": convo.timestamp,
            }
        )
    return conversation_with_username
