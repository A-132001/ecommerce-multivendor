from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle

import logging 
from .serializers import ProductSerializer, CategorySerializer
from .models import Product, Category

# Create your views here.

class LoginRateThrottle(UserRateThrottle):
    rate = '50/minute'

class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer
    throttle_classes = [UserRateThrottle]
    logger = logging.getLogger(__name__)

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Product.objects.all()
        
        # Vendor sees only their own products
        return Product.objects.filter(vendor__user=user)

    


