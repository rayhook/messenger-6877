from django.db import models


app_label = "messenger"


class BaseModel(models.Model):
    created_timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True


class Conversation(BaseModel):
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


class Message(BaseModel):
    conversation = models.ForeignKey(
        "messenger.Conversation", on_delete=models.CASCADE, related_name="messages"
    )
    text = models.TextField()
    user = models.ForeignKey("auth.user", on_delete=models.CASCADE)
