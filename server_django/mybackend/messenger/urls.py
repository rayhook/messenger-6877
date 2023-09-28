from django.urls import path
from . import views

urlpatterns = [
    path("", views.Homepage, name="index"),
    path("conversation/", views.Conversation.as_view(), name="conversation"),
]
