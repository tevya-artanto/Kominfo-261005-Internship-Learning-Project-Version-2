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


