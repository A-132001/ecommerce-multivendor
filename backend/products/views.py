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
    
    def perform_create(self, serializer):
        print(self.request.FILES) 
        # Automatically link the logged-in user
        serializer.save(user=self.request.user)

    # def get_queryset(self):
    #     return self.queryset.filter(user=self.request.user)
    
    def perform_update(self, serializer):
        # Ensure user can't override 'user' field during updates
        serializer.save(user=self.request.user)


    


