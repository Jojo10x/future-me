import traceback
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Goal
from .serializers import GoalSerializer
from .ai_recommendations import GoalAIAnalyzer 
from .ml_models import GoalCompletionPredictor, GoalStrategyOptimizer

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

    @action(detail=False, methods=["post"], url_path="train_ml_model")
    def train_ml_model(self, request):
        """Train ML models on user's historical goal data"""
        try:
            queryset = self.get_queryset()

            if queryset.count() < 10:
                return Response({
                    'error': 'Need at least 10 goals to train models',
                    'current_goals': queryset.count()
                }, status=status.HTTP_400_BAD_REQUEST)

            predictor = GoalCompletionPredictor()
            result = predictor.train_models(queryset)

            return Response({
                'message': 'Models trained successfully',
                **result
            })
        except Exception as e:
            import traceback
            return Response({
                'error': str(e),
                'trace': traceback.format_exc()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=["get"], url_path="predict_completion")
    def predict_completion(self, request, pk=None):
        """Get ML prediction for a specific goal"""
        try:
            goal = self.get_object()

            predictor = GoalCompletionPredictor()
            prediction = predictor.predict_goal_completion(goal)

            return Response(prediction)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["get"], url_path="ml_insights")
    def ml_insights(self, request):
     """Get comprehensive ML insights for all active goals"""
     try:
        
        current_year = timezone.now().year
        queryset = self.get_queryset().filter(
            is_completed=False,
            year=current_year
        )
        
        print(f"Processing {queryset.count()} active goals for {request.user.email}")
        
        predictor = GoalCompletionPredictor()
        
        predictions = []
        for goal in queryset:
            try:
                pred = predictor.predict_goal_completion(goal)
                predictions.append({
                    'goal': {
                        'id': goal.id,
                        'title': goal.title,
                        'year': goal.year
                    },
                    **pred
                })
            except Exception as e:
                print(f"Error predicting goal {goal.id}: {e}")
                traceback.print_exc()
                predictions.append({
                    'goal': {
                        'id': goal.id,
                        'title': goal.title,
                        'year': goal.year
                    },
                    'goal_id': goal.id,
                    'completion_probability': 0.5,
                    'estimated_days_to_complete': None,
                    'confidence_level': 'low',
                    'recommendations': ['Unable to generate prediction - train models'],
                    'risk_factors': []
                })
        
        predictions.sort(key=lambda x: x.get('completion_probability', 0.5))
        
        try:
            optimizer = GoalStrategyOptimizer()
            best_practices = optimizer.analyze_best_practices(self.get_queryset())
        except Exception as e:
            print(f"Error in best practices: {e}")
            traceback.print_exc()
            best_practices = {
                'subtask_effectiveness': {
                    'with_subtasks_avg_days': 0,
                    'without_subtasks_avg_days': 0,
                    'recommendation': 'Analysis unavailable',
                    'sample_size_with': 0,
                    'sample_size_without': 0
                },
                'best_quarter': None,
                'quarterly_avg_completion': {}
            }
        
        return Response({
            'predictions': predictions,
            'best_practices': best_practices,
            'summary': {
                'total_active_goals': len(predictions),
                'high_risk_goals': sum(1 for p in predictions if p.get('completion_probability', 1) < 0.4),
                'on_track_goals': sum(1 for p in predictions if p.get('completion_probability', 0) > 0.7)
            }
        })
     except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error in ml_insights: {error_trace}")
        
        return Response({
            'error': str(e),
            'trace': error_trace,
            'predictions': [],
            'best_practices': {},
            'summary': {
                'total_active_goals': 0,
                'high_risk_goals': 0,
                'on_track_goals': 0
            }
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def perform_update(self, serializer):
        goal = serializer.save()
        if 'is_completed' not in serializer.validated_data:
            goal.update_completion_status()
