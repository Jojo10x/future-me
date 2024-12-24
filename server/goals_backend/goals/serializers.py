from rest_framework import serializers
from .models import Goal, Subtask

class SubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtask
        fields = ['id', 'title', 'is_completed']  # Added 'id' to fields

class GoalSerializer(serializers.ModelSerializer):
    subtasks = SubtaskSerializer(many=True, required=False)
    
    class Meta:
        model = Goal
        fields = ['id', 'title', 'description', 'year', 'is_completed', 'subtasks']

    def create(self, validated_data):
        subtasks_data = validated_data.pop('subtasks', [])
        goal = Goal.objects.create(**validated_data)
        for subtask_data in subtasks_data:
            Subtask.objects.create(goal=goal, **subtask_data)
        return goal

    def update(self, instance, validated_data):
        subtasks_data = validated_data.pop('subtasks', [])
        
        # Update goal fields
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.year = validated_data.get('year', instance.year)
        instance.is_completed = validated_data.get('is_completed', instance.is_completed)
        instance.save()

        # Get existing subtask IDs
        existing_subtasks = {subtask.id: subtask for subtask in instance.subtasks.all()}
        
        # Update or create subtasks
        updated_subtask_ids = set()
        for subtask_data in subtasks_data:
            subtask_id = subtask_data.get('id')
            if subtask_id and subtask_id in existing_subtasks:
                # Update existing subtask
                subtask = existing_subtasks[subtask_id]
                subtask.title = subtask_data.get('title', subtask.title)
                subtask.is_completed = subtask_data.get('is_completed', subtask.is_completed)
                subtask.save()
                updated_subtask_ids.add(subtask_id)
            else:
                # Create new subtask
                new_subtask = Subtask.objects.create(goal=instance, **subtask_data)
                updated_subtask_ids.add(new_subtask.id)
        
        # Delete subtasks that weren't in the update data
        for subtask_id, subtask in existing_subtasks.items():
            if subtask_id not in updated_subtask_ids:
                subtask.delete()

        instance.update_completion_status()
        return instance