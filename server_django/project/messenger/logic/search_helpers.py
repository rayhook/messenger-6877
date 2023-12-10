from messenger.models import Conversation
from django.contrib.auth.models import User
from django.db.models import Q


def search_conversations(query, user):
    if query:
        users = User.objects.filter(username__icontains=query)
        conversations = Conversation.objects.filter(
            Q(user1=user, user2__in=users) | Q(user2=user, user1__in=users)
        ).distinct()

        return conversations


def search_new_contacts(query, conversations):
    existing_contact_ids = [c.user1.id for c in conversations] + [
        c.user2.id for c in conversations
    ]
    new_contacts = User.objects.exclude(id__in=existing_contact_ids).filter(
        username__icontains=query
    )

    new_contact_list = [
        {"id": contact.id, "with_user": contact.username} for contact in new_contacts
    ]

    return new_contact_list


def format_conversation_list(conversations, user):
    conversation_list = [
        {
            "id": conversation.id,
            "with_user": conversation.user2.username
            if conversation.user1 == user
            else conversation.user1.username,
            "timestamp": conversation.created_timestamp,
        }
        for conversation in conversations
    ]
    return conversation_list
