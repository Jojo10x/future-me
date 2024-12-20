from django.db import models
class Goal(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    year = models.IntegerField()  # Year for the goal
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

