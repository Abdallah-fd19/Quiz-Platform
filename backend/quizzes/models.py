from django.db import models
from django.contrib.auth.models import User 
import uuid
# Create your models here.
class Quiz(models.Model):
 id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False) 
 title = models.CharField(max_length=200)
 description = models.TextField(blank=True, null=True)
 created_at = models.DateTimeField(auto_now_add=True)

 def __str__(self):
  return self.title
 
class Question(models.Model):
 id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
 quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
 text = models.CharField(max_length=300)

 def __str__(self):
  return self.text
      
class Choice(models.Model):
 id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
 question = models.ForeignKey(Question, on_delete=models.CASCADE)
 text = models.CharField(max_length=200)
 is_correct = models.BooleanField(default=False)
 
 def __str__(self):
  return self.text
 
class QuizAttempt(models.Model):
 id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
 user = models.ForeignKey(User, on_delete=models.CASCADE)
 quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
 score = models.FloatField(default=0)
 completed_at = models.DateTimeField(auto_now_add=True)

 def __str__(self):
  return f"{self.user.username} - {self.quiz.title} ({self.score}%)"

class UserAnswer(models.Model):
 id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
 attempt = models.ForeignKey(QuizAttempt, on_delete=models.CASCADE)
 question = models.ForeignKey(Question, on_delete=models.CASCADE)
 selected_choice = models.ForeignKey(Choice, on_delete=models.CASCADE)

 class Meta:
  unique_together = ('attempt', 'question')

 def __str__(self):
  return f"{self.attempt.user.username}: {self.question.text[:30]}"