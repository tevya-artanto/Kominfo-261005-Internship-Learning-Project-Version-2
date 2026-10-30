"""
URL configuration for catGallery project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from catGallery.catG.views import (
    ReactView,
    addTexttoCat,
    AllCats,
    getSpecificCat,
    getTag
)


urlpatterns = [

    path(
        "admin/",
        admin.site.urls
    ),

    # gets paginated cats
    path(
        "api/cats/",
        AllCats.as_view(),
        name="allCats"
    ),

    # gets tags from CatAAS
    path(
        "api/tags/",
        getTag,
        name="getTags"
    ),

    # gets one selected cat
    path(
        "api/cats/<str:pk>",
        getSpecificCat,
        name="getSpecificCat"
    ),

    # comments for selected cat
    path(
        "api/cats/<str:pk>/comments/",
        ReactView.as_view(),
        name="comments"
    ),

    # adds text to selected cat
    path(
        "api/cats/<str:pk>/says/",
        addTexttoCat,
        name="addText"
    ),
]