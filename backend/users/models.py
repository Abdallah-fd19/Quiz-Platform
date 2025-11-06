from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class UserProfile(models.Model):
 user = models.OneToOneField(User, on_delete=models.CASCADE)
 total_score = models.IntegerField(default=0)
 level = models.CharField(max_length=20, default='Beginner')

 def __str__(self):
  return self.user.username
 