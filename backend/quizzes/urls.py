from django.urls import path
from .views import QuizListCreateView, QuizDetailView, QuestionListCreateView, QuestionDetailView, ChoiceListCreateView, ChoiceDetailView, SubmitQuizView, GenerateQuizAPIView, DashboardAPIView

urlpatterns = [
 # Quiz URLs
 path('', QuizListCreateView.as_view(), name="quiz-list-create"),
 path('<uuid:pk>/', QuizDetailView.as_view(), name="quiz-detail"),
 
 # Question URLs
 path('<uuid:quiz_id>/questions/', QuestionListCreateView.as_view(), name="question-list-create"),
 path('questions/<uuid:pk>/', QuestionDetailView.as_view(), name="question-detail"),
 
 # Choices URLs
 path('<uuid:question_id>/choices/', ChoiceListCreateView.as_view(), name="choice-list-create"),
 path('choices/<uuid:pk>/', ChoiceDetailView.as_view(), name="choice-detail"),

 # SubmitQuiz URL
 path('<uuid:quiz_id>/submit/', SubmitQuizView.as_view(), name="submit-quiz"),

 # AI Generate quiz
 path('generate-quiz/', GenerateQuizAPIView.as_view(), name='generate-quiz'), 

 # Dashboard URL
 path('dashboard/stats/', DashboardAPIView.as_view(), name='dashboard-stats')
]