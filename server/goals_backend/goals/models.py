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

 # Method to check if all subtasks are completed and update the main goal
    def update_completion_status(self):
        if self.subtasks.filter(is_completed=False).exists():
            self.is_completed = False
        else:
            self.is_completed = True
        self.save()


class Subtask(models.Model):
    goal = models.ForeignKey(Goal, related_name='subtasks', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title