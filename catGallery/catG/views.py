from urllib.parse import quote, urlencode
from rest_framework.decorators import api_view
from .models import Comment
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CommentSerializer
import requests, datetime, json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.pagination import LimitOffsetPagination
from catGallery.catG.serializers import CommentSerializer
from django.db import connection

# Pagination Settings
class localPagination(LimitOffsetPagination):
    default_limit = 8

# Gets all cats and paginates
class AllCats(APIView):
    pagination_class = localPagination

    def get(self, request, *args, **kwargs):
        paginator = self.pagination_class()

        # Get page limit
        limit = paginator.get_limit(request)
        # Get offset (index of first cat)
        offset = paginator.get_offset(request)
        # Get tag if sent
        tag = request.GET.get('tag')

        catURL = "https://cataas.com/api/cats"
        params = {
            "limit": limit,
            "skip": offset,
        }

        if tag:
            params['tags'] = tag    

        try:
            response = requests.get(catURL, params=params, timeout=15)
            data = response.json()        
        except requests.exceptions.HTTPError as e:
            return JsonResponse(e, safe=False)

        # gets total number of cats from CatAAS
        countResponse = requests.get(
            "https://cataas.com/api/count",
            timeout=15
        )

        countResponse.raise_for_status()

        totalCats = countResponse.json()["count"]

        # returns the cats that were already paginated by CatAAS
        return Response({
            "count": totalCats,
            "results": data
        })

        # Paginates data
        # paginatedData = paginator.paginate_queryset(data, request, view=self)
        # return paginator.get_paginated_response(paginatedData)

# [DEPRECATED] Get all cat data from CataaS API
# def getCat(request):
#     catURL = "https://cataas.com/api/cats?limit=1987&skip=0"
#     try:
#         response = requests.get(catURL, timeout=5)
#         data = response.json()
#         return JsonResponse(data, safe=False)        
#     except requests.exceptions.HTTPError as e:
#         return JsonResponse(e, safe=False)

# Get specific cat when clicking on image in gallery view
@csrf_exempt
@api_view(["POST"])
def getSpecificCat(request, pk):
    catImage = (f"https://cataas.com/cat/"f"{pk}")
    catJsonReq = requests.get("https://cataas.com/cat/" + pk + "?json=true", timeout=5)
    catJson = catJsonReq.json()
    catTags = catJson["tags"]
    return Response({"image_url": catImage, "tags": catTags})

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
        getQuery = "SELECT * FROM catG_comment WHERE catID = '" + pk + "';"
        with connection.cursor() as cursor:
            cursor.execute(getQuery)
            rows = cursor.fetchall()

        allComments = [
            {"id": obj[0], "catID": obj[1], "username": obj[2], "content": obj[3], "date_posted": obj[4]}
            for obj in rows
        ]

        return Response(allComments)

        # [DEPRECATED]
        # detail = [
        #     {"id": obj.id, "catID": pk, "username": obj.username, "content": obj.content, "date_posted": obj.date_posted}
        #     for obj in Comment.objects.all()
        # ]
        # return Response(detail)

    def post(self, request, pk):
        currentTime = datetime.datetime.now()
        postQuery = "INSERT INTO catG_comment (catID, username, content, date_posted) VALUES (%s, %s, %s, %s)"
        with connection.cursor() as cursor:
            cursor.execute(postQuery, [request.data.get("catID"), request.data.get("username"), request.data.get("content"), currentTime.strftime("%c")])
            newComment = {"id": cursor.lastrowid, "catID" : request.data.get("catID"), "username" : request.data.get("username"), "content" : request.data.get("content"), "date_posted" : currentTime.strftime("%c")}
        return Response(newComment)
        
        # [DEPRECATED]
        #  serializer = CommentSerializer(data=request.data)
        # if serializer.is_valid(raise_exception=True):
        #     serializer.save()
        #     return Response(serializer.data)

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