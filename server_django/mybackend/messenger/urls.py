from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views

urlpatterns = [
    path("register/", views.RegisterView.as_view(), name="register"),
    path("login/", views.LoginView.as_view(), name="login"),
    path("logout/", views.LogoutView.as_view(), name="logout"),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("conversations/", views.ConversationView.as_view(), name="conversations"),
    path("search/", views.SearchView.as_view(), name="search"),
    path("update/messages/", views.NewMessage.as_view(), name="update_message"),
    path("messages/", views.MessageView.as_view(), name="messages"),
]
