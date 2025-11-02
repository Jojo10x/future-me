from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Goal
from .serializers import GoalSerializer
from .ai_recommendations import GoalAIAnalyzer 

class GoalViewSet(viewsets.ModelViewSet):
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Goal.objects.filter(user=self.request.user)
        year = self.request.query_params.get('year')
        if year is not None:
            queryset = queryset.filter(year=year)
        return queryset

    @action(detail=True, methods=['post'])
    def toggle_completion(self, request, pk=None):
        goal = self.get_object()  
        goal.is_completed = not goal.is_completed
        if goal.is_completed:
            goal.completed_at = timezone.now()
        else:
            goal.completed_at = None
        goal.save()
        if not goal.is_completed:
            goal.subtasks.all().update(is_completed=False)
        serializer = self.get_serializer(goal)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="ai_recommendations")
    def ai_recommendations(self, request):
        try:
            import traceback

            queryset = self.get_queryset()
            print(f"Queryset count: {queryset.count()}")

            analyzer = GoalAIAnalyzer(queryset)
            print("Analyzer created successfully")

            result = analyzer.generate_recommendations()
            print("Recommendations generated successfully")

            return Response(result)
        except Exception as e:
            import traceback

            error_trace = traceback.format_exc()
            print(f"Error in ai_recommendations: {error_trace}")
            return Response(
                {"error": str(e), "trace": error_trace},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def perform_update(self, serializer):
        goal = serializer.save()
        if 'is_completed' not in serializer.validated_data:
            goal.update_completion_status()
