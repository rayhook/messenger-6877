from django.db import models


app_label = "messenger"


class Conversation(models.Model):
    user1 = models.ForeignKey(
        "auth.User",
        related_name="user1",
        on_delete=models.CASCADE,
    )
    user2 = models.ForeignKey(
        "auth.User",
        related_name="user2",
        on_delete=models.CASCADE,
        null=True,
    )
    timestamp = models.DateTimeField(auto_now=True, auto_now_add=False)


class Message(models.Model):
    conversation = models.ForeignKey("messenger.Conversation", on_delete=models.CASCADE)
    text = models.TextField()
    user = models.ForeignKey("auth.user", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now=True)
