from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views

urlpatterns = [
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("users/", views.UsersView.as_view(), name="users"),
    path(
        "conversation/create/",
        views.ConversationCreateView.as_view(),
        name="conversation_create",
    ),
    path("messages/", views.MessageView.as_view(), name="messages"),
    path(
        "search/",
        views.SearchView.as_view(),
        name="search",
    ),
    path("update/messages/", views.NewMessage.as_view(), name="last_message"),
    path("conversations/", views.ConversationsView.as_view(), name="conversations"),
    path("register/", views.RegisterView.as_view(), name="register"),
    path("login/", views.LoginView.as_view(), name="login"),
    path("logout/", views.LogoutView.as_view(), name="logout"),
]
