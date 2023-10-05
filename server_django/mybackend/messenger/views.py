from django.http import HttpResponse, JsonResponse
from django.views import View
from django.shortcuts import render

from messenger.models import Conversations


def Homepage(request):
    return HttpResponse("Welcome to the messenger app homepage")


def index(request):
    return render(request, "messenger/index.html")


def room(request, room_name):
    return render(request, "messenger/room.html", {"room_name": room_name})


class ConversationsView(View):
    def get(self, request):
        conversations = Conversations.objects.all()
        response = {"conversations": list(conversations.values())}
        return JsonResponse(response)
