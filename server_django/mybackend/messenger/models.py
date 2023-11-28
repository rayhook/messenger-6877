from django.db import models
from django.contrib.auth.models import User

app_label = "messenger"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)


class Conversations(models.Model):
    user = models.ForeignKey(
        UserProfile, related_name="user_conversations", on_delete=models.CASCADE
    )
    other_user = models.ForeignKey(
        UserProfile,
        related_name="other_user_conversations",
        on_delete=models.CASCADE,
        null=True,
    )
    timestamp = models.DateTimeField(auto_now=True, auto_now_add=False)


class Messages(models.Model):
    conversation = models.ForeignKey(Conversations, on_delete=models.CASCADE)
    text = models.TextField()
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now=True)
