from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from goals.views import GoalViewSet

router = DefaultRouter()
router.register(r'goals', GoalViewSet,basename='goal')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/', include('authentication.urls')),
]

