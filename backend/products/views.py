from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from rest_framework.exceptions import PermissionDenied
from .permissions import IsVendorOwner
import logging 
from .serializers import ProductSerializer, CategorySerializer
from .models import Product, Category
from vendors.models import Vendor
from rest_framework.parsers import MultiPartParser, FormParser

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    throttle_classes = [UserRateThrottle]
    logger = logging.getLogger(__name__)
    permission_classes = [IsAuthenticated, IsVendorOwner]
    parser_classes = [MultiPartParser, FormParser] 

    
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Product.objects.all()
        return Product.objects.filter(vendor__user=user)
 
    def perform_create(self, serializer):
        try:
            vendor = Vendor.objects.get(user=self.request.user)
        except Vendor.DoesNotExist:
            raise PermissionDenied("You must be a vendor to add products.")
        serializer.save(vendor=vendor)

    def perform_update(self, serializer):
        product = self.get_object()
        if product.vendor.user != self.request.user:
            raise PermissionDenied("You do not have permission to update this product.")
        serializer.save(vendor=product.vendor)

    def perform_destroy(self, instance):
        if instance.vendor.user != self.request.user and not self.request.user.is_superuser:
            raise PermissionDenied("You do not have permission to delete this product.")
        instance.delete()


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle]
