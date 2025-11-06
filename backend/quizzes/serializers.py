from rest_framework import serializers
from .models import Quiz, Question, Choice

# -------------------- READ-ONLY SERIALIZERS --------------------
class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'question', 'text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True, source='choice_set')

    class Meta:
        model = Question
        fields = ['id', 'quiz', 'text', 'choices']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True, source='question_set')

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'created_at', 'questions']


# -------------------- WRITABLE NESTED SERIALIZERS --------------------
class ChoiceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text', 'is_correct']

class QuestionCreateSerializer(serializers.ModelSerializer):
    choices = ChoiceCreateSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'choices']

class QuizNestedCreateSerializer(serializers.ModelSerializer):
    questions = QuestionCreateSerializer(many=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'questions']

    def create(self, validated_data):
        questions_data = validated_data.pop('questions', [])
        quiz = Quiz.objects.create(**validated_data)
        for q_data in questions_data:
            choices_data = q_data.pop('choices', [])
            question = Question.objects.create(quiz=quiz, **q_data)
            for c_data in choices_data:
                Choice.objects.create(question=question, **c_data)
        return quiz
