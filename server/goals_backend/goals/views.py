from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Goal
from .serializers import GoalSerializer

class GoalViewSet(viewsets.ModelViewSet):
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter goals by the current user
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

    def perform_update(self, serializer):
        goal = serializer.save()
        
        if 'is_completed' not in serializer.validated_data:
            goal.update_completion_status()