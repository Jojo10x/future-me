from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, RegisterSerializer
from rest_framework.permissions import AllowAny

import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])  # Make sure this is imported and applied
def register(request):
    print(request.data)  # Add this to debug the incoming data
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Success"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])  
@permission_classes([IsAuthenticated])
def get_user_profile(request):

    user = request.user
    
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        logger.info(f"Profile update request data: {request.data}")
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Profile updated successfully for user: {user}")
            return Response(serializer.data)
        logger.error(f"Profile update validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)