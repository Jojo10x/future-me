from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, RegisterSerializer

import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
def register(request):
    logger.info(f"Request data: {request.data}")
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        logger.info(f"User created: {user}")
        return Response({
            "user": UserSerializer(user).data,
            "message": "User Created Successfully"
        }, status=status.HTTP_201_CREATED)
    logger.error(f"Validation errors: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
