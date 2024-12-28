from rest_framework import serializers
from .models import Goal, Subtask

class SubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtask
        fields = ['id', 'title', 'is_completed']

class GoalSerializer(serializers.ModelSerializer):
    subtasks = SubtaskSerializer(many=True, required=False)

    class Meta:
        model = Goal
        fields = ['id', 'title', 'description', 'year', 'is_completed', 'subtasks', 'created_at', 'updated_at']
        read_only_fields = ['user']

    def create(self, validated_data):
        subtasks_data = validated_data.pop('subtasks', [])
        
        validated_data['user'] = self.context['request'].user
        goal = Goal.objects.create(**validated_data)
        
        for subtask_data in subtasks_data:
            Subtask.objects.create(goal=goal, **subtask_data)
        return goal

    def update(self, instance, validated_data):
        subtasks_data = validated_data.pop('subtasks', [])

        
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.year = validated_data.get('year', instance.year)
        instance.is_completed = validated_data.get('is_completed', instance.is_completed)
        instance.save()

        
        existing_subtasks = {subtask.id: subtask for subtask in instance.subtasks.all()}

        
        updated_subtask_ids = set()
        for subtask_data in subtasks_data:
            subtask_id = subtask_data.get('id')
            if subtask_id and subtask_id in existing_subtasks:
                
                subtask = existing_subtasks[subtask_id]
                subtask.title = subtask_data.get('title', subtask.title)
                subtask.is_completed = subtask_data.get('is_completed', subtask.is_completed)
                subtask.save()
                updated_subtask_ids.add(subtask_id)
            else:
                
                new_subtask = Subtask.objects.create(goal=instance, **subtask_data)
                updated_subtask_ids.add(new_subtask.id)

        
        for subtask_id, subtask in existing_subtasks.items():
            if subtask_id not in updated_subtask_ids:
                subtask.delete()

        instance.update_completion_status()
        return instance