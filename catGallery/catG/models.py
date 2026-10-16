from django.db import models
from django.utils import timezone

# Create your models here.

class Comment(models.Model):
    id = models.TextField(primary_key=True)
    catID = models.TextField()
    username = models.TextField()
    content = models.TextField()
    date_posted = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user}'
