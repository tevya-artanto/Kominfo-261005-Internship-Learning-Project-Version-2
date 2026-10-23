from urllib.parse import quote, urlencode
from rest_framework.decorators import api_view
from django.shortcuts import render
from .models import Comment
from rest_framework import permissions, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CommentSerializer
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

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
@csrf_exempt
@api_view(["POST"])
def addTexttoCat(request, pk):

    # gets values sent from React
    text = request.data.get("text", "")
    size = request.data.get("size", 50)
    color = request.data.get("color", "#ffffff")

    # checks if text is empty
    if not text:
        return Response(
            {"error": "Text is required"},status=400)
    # makes text safe for URL
    safe_text = quote(str(text),safe="")
    # creates CatAAS query settings
    query = urlencode({"fontSize": size,"fontColor": color})
    # creates CatAAS image URL
    image_url = (f"https://cataas.com/cat/"f"{pk}/says/{safe_text}?{query}")
    # sends image URL back to React
    return Response({"image_url": image_url})