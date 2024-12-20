from rest_framework import viewsets
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
