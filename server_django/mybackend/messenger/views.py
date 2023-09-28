from django.http import HttpResponse, JsonResponse

# from messenger.models import Conversations, Messages
from django.views import View


def Homepage(request):
    return HttpResponse("Welcome to the messenger app homepage")


class Conversation(View):
    def get(self, request):
        response = {"message": "Serving you all the conversations "}
        return JsonResponse(response)
