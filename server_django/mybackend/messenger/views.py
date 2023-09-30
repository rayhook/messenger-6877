from django.http import HttpResponse, JsonResponse
from django.views import View

from messenger.models import Conversations


def Homepage(request):
    return HttpResponse("Welcome to the messenger app homepage")


class ConversationsView(View):
    def get(self, request):
        conversations = Conversations.objects.all()
        response = {"conversations": list(conversations.values())}
        return JsonResponse(response)
