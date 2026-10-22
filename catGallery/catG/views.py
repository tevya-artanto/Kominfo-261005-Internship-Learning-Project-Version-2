from django.shortcuts import render
from .models import Comment
from rest_framework import permissions, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CommentSerializer
import requests
from django.http import JsonResponse

from catGallery.catG.serializers import CommentSerializer

# Get cat data from CataaS API
def getCat(request):
    catURL = "https://cataas.com/api/cats"
    try:
        response = requests.get(catURL, timeout=5)
        data = response.json()
        return JsonResponse(data, safe=False)        
    except requests.exceptions.HTTPError as e:
        return JsonResponse(e, safe=False)

# Gets list of tags
def getTag(request):
    tagURL = "https://cataas.com/api/tags"
    try:
        response = requests.get(tagURL, timeout=5)
        data = response.json()
        return JsonResponse(data, safe=False)        
    except requests.exceptions.HTTPError as e:
        return JsonResponse(e, safe=False)

# Comment function
class ReactView(APIView):
    serializer_class = CommentSerializer

    def get(self, request, pk):
        detail = [
            {"id": obj.id, "catID": pk, "username": obj.username, "content": obj.content, "date_posted": obj.date_posted}
            for obj in Comment.objects.all()
        ]
        return Response(detail)

    def post(self, request, pk):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

# Adds text to chosen cat image
def addTexttoCat(request, pk, text, size, color):
    # color is passed without the hashtag
    url = "https://cataas.com/cat/" + pk + "/says/" + text + "?fontSize=" + size + "&fontColor=%23" + color
    try:
        response = requests.get(url, timeout=5)
        data = response.json()
        return JsonResponse(data, safe=False)        
    except requests.exceptions.HTTPError as e:
        return JsonResponse(e, safe=False)

