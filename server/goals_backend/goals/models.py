from django.utils import timezone
from django.db import models
from django.conf import settings

class Goal(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='goals',
        on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    year = models.IntegerField() 
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - {self.title}"

    def update_completion_status(self):
        if not self.subtasks.exists():
            self.is_completed = False
        elif self.subtasks.filter(is_completed=False).exists():
            self.is_completed = False
        else:
            self.is_completed = True
            self.completed_at = timezone.now()
        self.save()

class Subtask(models.Model):
    goal = models.ForeignKey(Goal, related_name='subtasks', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title