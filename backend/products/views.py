from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from django.shortcuts import get_object_or_404
import logging 
from .serializers import ProductSerializer, CategorySerializer
from .models import Product, Category

# Create your views here.

class LoginRateThrottle(UserRateThrottle):
    rate = '50/minute'

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer
    throttle_classes = [UserRateThrottle]
    logger = logging.getLogger(__name__)


