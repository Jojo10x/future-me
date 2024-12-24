# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Goal
from .serializers import GoalSerializer

class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer

    def get_queryset(self):
        queryset = Goal.objects.all()
        year = self.request.query_params.get('year')
        if year is not None:
            queryset = queryset.filter(year=year)
        return queryset

    @action(detail=True, methods=['post'])
    def toggle_completion(self, request, pk=None):
        goal = self.get_object()
        # Toggle the completion status
        goal.is_completed = not goal.is_completed
        goal.save()
        
        # If uncompleting the goal, also uncomplete all subtasks
        if not goal.is_completed:
            goal.subtasks.all().update(is_completed=False)
        
        serializer = self.get_serializer(goal)
        return Response(serializer.data)

    def perform_update(self, serializer):
        goal = serializer.save()
        # Only update completion status based on subtasks if the goal itself wasn't directly modified
        if 'is_completed' not in serializer.validated_data:
            goal.update_completion_status()