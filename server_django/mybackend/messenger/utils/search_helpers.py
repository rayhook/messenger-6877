from messenger.models import UserProfile, Conversation
from django.db.models import Q


def search_conversations(search_query, current_user_profile):
    if search_query:
        users = UserProfile.objects.filter(user__username__icontains=search_query)
        conversations = Conversation.objects.filter(
            Q(user=current_user_profile, other_user__in=users)
            | Q(other_user=current_user_profile, user__in=users)
        ).distinct()

        return conversations


def search_new_contacts(search_query, conversations):
    existing_contact_ids = [c.user.id for c in conversations] + [
        c.other_user.id for c in conversations
    ]
    new_contacts = UserProfile.objects.exclude(id__in=existing_contact_ids).filter(
        user__username__icontains=search_query
    )

    new_contact_list = [
        {"id": contact.id, "with_user": contact.user.username}
        for contact in new_contacts
    ]

    return new_contact_list


def format_conversation_list(conversations, current_user_profile):
    conversation_list = [
        {
            "id": conversation.id,
            "with_user": conversation.other_user.user.username
            if conversation.user == current_user_profile
            else conversation.user.user.username,
            "timestamp": conversation.timestamp,
        }
        for conversation in conversations
    ]
    return conversation_list
