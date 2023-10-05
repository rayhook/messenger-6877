from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("<str:room_name>/", views.room, name="name"),
    path("conversations/", views.ConversationsView.as_view(), name="conversations"),
]
