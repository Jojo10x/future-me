from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import ValidationError

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'full_name')
        read_only_fields = ('id',)

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = ('email', 'password', 'full_name')
        extra_kwargs = {
            'email': {'required': True},
            'full_name': {'required': True}
        }

    def create(self, validated_data):
        if User.objects.filter(email=validated_data['email']).exists():
            raise ValidationError({"email": "A user with this email already exists."})

        user = User.objects.create(
            email=validated_data['email'],
            username=validated_data['email'],  # Set username to email
            full_name=validated_data['full_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
