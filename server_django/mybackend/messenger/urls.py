from django.urls import path
from . import views

urlpatterns = [
    path("", views.Homepage, name="index"),
    path("conversations/", views.ConversationsView.as_view(), name="conversations"),
]
