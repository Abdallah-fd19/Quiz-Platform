from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from dotenv import load_dotenv
from django.db.models import Avg, Count, F
import dotenv
from django.shortcuts import get_object_or_404
from .models import Quiz, Question, Choice, QuizAttempt, UserAnswer
from rest_framework.pagination import PageNumberPagination
from .serializers import QuizSerializer, QuestionSerializer, ChoiceSerializer, QuizNestedCreateSerializer
import requests

load_dotenv()
GOOGLE_API_KEY = dotenv.get_key(dotenv.find_dotenv(), "GOOGLE_GEMINI_API_KEY")

# ------------------- QUIZ CRUD -------------------
class QuizListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def get(self, request):
        quizzes = Quiz.objects.all()
        paginator = PageNumberPagination()
        paginator.page_size = 6
        result_page = paginator.paginate_queryset(quizzes, request)
        serializer = QuizSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    def post(self, request):
        serializer = QuizNestedCreateSerializer(data=request.data)
        if serializer.is_valid():
            quiz = serializer.save()
            return Response(QuizSerializer(quiz).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuizDetailView(APIView):
    def get_permissions(self):
        if self.request.method == 'PUT' or self.request.method == 'DELETE':
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def get_object(self, pk):
        try:
            return Quiz.objects.get(id=pk)
        except Quiz.DoesNotExist:
            return None

    def get(self, request, pk):
        quiz = self.get_object(pk)
        if quiz is None:
            return Response({'error': 'Quiz not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = QuizSerializer(quiz)
        return Response(serializer.data)

    def put(self, request, pk):
        quiz = self.get_object(pk)
        if quiz is None:
            return Response({'error': 'Quiz not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = QuizSerializer(quiz, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        quiz = self.get_object(pk)
        if quiz is None:
            return Response({'error': 'Quiz not found'}, status=status.HTTP_404_NOT_FOUND)
        quiz.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ------------------- QUESTION CRUD -------------------
class QuestionListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def get(self, request, quiz_id):
        questions = Question.objects.filter(quiz_id=quiz_id)        
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)

    def post(self, request, quiz_id):
        request.data['quiz'] = quiz_id
        serializer = QuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class QuestionDetailView(APIView):
    def get_permissions(self):
        if self.request.method == 'PUT' or self.request.method == 'DELETE':
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def get_object(self, pk):
        try:
            return Question.objects.get(id=pk)
        except Question.DoesNotExist:
            return None

    def get(self, request, pk):
        question = self.get_object(pk)
        if question is None:
            return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = QuestionSerializer(question)
        return Response(serializer.data)

    def put(self, request, pk):
        question = self.get_object(pk)
        if question is None:
            return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = QuestionSerializer(question, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        question = self.get_object(pk)
        if question is None:
            return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)
        question.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ------------------- CHOICE CRUD -------------------
class ChoiceListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def get(self, request, question_id):
        choices = Choice.objects.filter(question_id=question_id)
        serializer = ChoiceSerializer(choices, many=True)
        return Response(serializer.data)

    def post(self, request, question_id):
        request.data['question'] = question_id
        serializer = ChoiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChoiceDetailView(APIView):
    def get_permissions(self):
        if self.request.method == 'PUT' or self.request.method == 'DELETE':
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def get_object(self, pk):
        try:
            return Choice.objects.get(id=pk)
        except Choice.DoesNotExist:
            return None
        
    def get(self, request, pk):
        choice = self.get_object(pk)
        if not choice:
            return Response({'error':'Choice not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ChoiceSerializer(choice)
        return Response(serializer.data)
    
    def put(self, request, pk):
        choice = self.get_object(pk)
        if not choice:
            return Response({'error': 'Choice not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ChoiceSerializer(choice, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        choice = self.get_object(pk)
        if not choice:
            return Response({'error': 'Choice not found'}, status=status.HTTP_404_NOT_FOUND)
        choice.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class SubmitQuizView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, quiz_id):
        user = request.user
        quiz = get_object_or_404(Quiz, id=quiz_id)
        answers = request.data.get('answers', [])

        # Create QuizAttempt
        attempt = QuizAttempt.objects.create(user=user, quiz=quiz)
        user_answers = []

        correct = 0
        for ans in answers:
            question = get_object_or_404(Question, id=ans['question'])
            choice = get_object_or_404(Choice, id=ans['choice'])
            
            if choice.is_correct:
                correct += 1
            
            user_answers.append(
                UserAnswer(
                    attempt=attempt,
                    question=question,
                    selected_choice=choice
                )
            )

        # Bulk insert all answers
        UserAnswer.objects.bulk_create(user_answers)

        # Compute score
        total_questions = quiz.question_set.count()
        score = (correct / total_questions * 100) if total_questions > 0 else 0
        attempt.score = score
        attempt.save()
        return Response({"score":score}, status=status.HTTP_201_CREATED)

class GenerateQuizAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        topic = request.data.get("topic")
        num_questions = request.data.get("num_questions", 5)

        if not topic:
            return Response({"error":"Topic is required"}, status=400)
        
        if not GOOGLE_API_KEY:
            return Response({"error":"Google Gemini API key not configured"}, status=500)

        prompt = f"""
        Generate a quiz on the topic '{topic}' with {num_questions} multiple-choice questions.
        Provide JSON in this format:
        {{
            "title": "{topic} Quiz",
            "description": "Quiz description",
            "questions": [
                {{
                    "text": "Question text",
                    "choices": [
                        {{"text": "Choice 1", "is_correct": true}},
                        {{"text": "Choice 2", "is_correct": false}}
                    ]
                }}
            ]
        }}
        """

        model_name = "gemini-2.5-flash"
        url = f"https://generativelanguage.googleapis.com/v1/models/{model_name}:generateContent?key={GOOGLE_API_KEY}"
        headers = {
            "Content-Type": "application/json"
        }
        data = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 2000
            }
        }

        try:
            response = requests.post(url, json=data, headers=headers)            
            
            if response.status_code == 400:
                error_data = response.json() if response.text else {}
                return Response({
                    "error": "Bad request to Gemini API", 
                    "details": error_data.get("error", {}).get("message", response.text)
                }, status=400)
            elif response.status_code == 403:
                return Response({
                    "error": "API key invalid or quota exceeded", 
                    "details": "Check your GOOGLE_GEMINI_API_KEY and usage limits"
                }, status=403)
            elif response.status_code != 200:            
                return Response({
                    "error": "AI generation failed", 
                    "details": response.text,
                    "status_code": response.status_code
                }, status=500)
        except requests.exceptions.RequestException as e:
            return Response({
                "error": "Network error connecting to Gemini API", 
                "details": str(e)
            }, status=500)

        import json
        try:
            response_data = response.json()
            if "candidates" not in response_data or not response_data["candidates"]:
                return Response({"error": "No content generated", "details": response_data}, status=500)
            
            content_str = response_data["candidates"][0]["content"]["parts"][0]["text"]
            
            # Remove markdown code blocks if present
            json_content = content_str.strip()
            if json_content.startswith('```json'):
                json_content = json_content[7:]  # Remove ```json
            if json_content.endswith('```'):
                json_content = json_content[:-3]  # Remove ```
            json_content = json_content.strip()
            
            # Check if JSON is complete (has proper closing braces)
            if not json_content.endswith('}'):
                # Try to find the last complete object
                last_brace = json_content.rfind('}')
                if last_brace > 0:
                    json_content = json_content[:last_brace + 1]
                else:
                    return Response({
                        "error": "Incomplete JSON response from AI", 
                        "details": "Response was truncated. Try reducing the number of questions.",
                        "raw_content": content_str[:500] + "..."
                    }, status=500)
            
            quiz_json = json.loads(json_content)
        except (KeyError, IndexError, json.JSONDecodeError) as e:
            return Response({"error": "Failed to parse AI response", "details": str(e), "raw_response": response.text}, status=500)

        serializer = QuizNestedCreateSerializer(data=quiz_json)
        if serializer.is_valid():
            quiz = serializer.save()
            return Response(QuizSerializer(quiz).data, status=201)
        else:
            return Response(serializer.errors, status=400)

class DashboardAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        # Total attempts
        total_attempts = QuizAttempt.objects.filter(user=user).count()
        # Average score accros attempts
        avg_score = QuizAttempt.objects.filter(user=user).aggregate(avg=Avg('score'))['avg'] or 0
        # Recent attempts (limit 5)
        recent_attempts_queryset = QuizAttempt.objects.filter(user=user).order_by('-completed_at')[:5]
        recent_attempts = []
        for a in recent_attempts_queryset:
            recent_attempts.append({"id":a.id, "quiz_title":a.quiz.title, "score":a.score, "completed_at":a.completed_at})
        # Correct vs Wrong (all attempts)
        answers = UserAnswer.objects.filter(attempt__user=user)
        correct_answers = answers.filter(selected_choice__is_correct=True).count()
        wrong_answers = answers.filter(selected_choice__is_correct=False).count()
        # Average score per quiz (for quizzes user attempted)
        per_quiz = QuizAttempt.objects.filter(user=user).values(quiz_title=F('quiz__title')).annotate(avg_score=Avg('score'), attempts=Count('id')).order_by('-avg_score')[:10]
        per_quiz_list = []
        for q in per_quiz:
            per_quiz_list.append({"quiz_title": q["quiz_title"], "avg_score": round(q["avg_score"] or 0, 2), "attempts": q["attempts"]})

        payload = {
            "user_name":user.username,
            "total_attempts":total_attempts,
            "avg_score": avg_score,
            "recent_attempts": recent_attempts,
            "correct_answers":correct_answers,
            "wrong_answers":wrong_answers,
            "per_quiz_list":per_quiz_list
        }
        return Response(payload)