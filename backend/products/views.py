from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response
from .permissions import IsVendorOwnerOrReadOnly
import logging 
from .serializers import ProductSerializer, CategorySerializer
from .models import Product, Category
from vendors.models import Vendor
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .models import Category, Vendor
from .serializers import CategorySerializer
from rest_framework.permissions import AllowAny
# Add caching imports
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie, vary_on_headers
from django.conf import settings
from django.core.cache import cache

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    throttle_classes = [UserRateThrottle]
    logger = logging.getLogger(__name__)
    permission_classes = [IsAuthenticated, IsVendorOwnerOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def get_cache_key(self, request, *args, **kwargs):
        """Generate a unique cache key based on the request parameters"""
        user_id = request.user.id if request.user.is_authenticated else 'anonymous'
        vendor_id = request.query_params.get('vendor_id', 'all')
        return f"product_list_{user_id}_{vendor_id}"

    def list(self, request, *args, **kwargs):
        cache_key = self.get_cache_key(request)
        cached_response = cache.get(cache_key)
        
        if cached_response is not None:
            return Response(cached_response)

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        response_data = serializer.data
        
        cache.set(cache_key, response_data, timeout=settings.CACHE_TTL['product_list'])
        return Response(response_data)

    def get_queryset(self):
        user = self.request.user
        vendor_id = self.request.query_params.get("vendor_id")

        if user.is_superuser:
            return Product.objects.all()
        elif vendor_id:
            return Product.objects.filter(vendor__id=vendor_id)
        else:
            return Product.objects.filter(vendor__user=user)

    def retrieve(self, request, *args, **kwargs):
        cache_key = f"product_detail_{kwargs['pk']}"
        cached_response = cache.get(cache_key)
        
        if cached_response is not None:
            return Response(cached_response)

        response = super().retrieve(request, *args, **kwargs)
        cache.set(cache_key, response.data, timeout=settings.CACHE_TTL['product_detail'])
        return response

    def perform_create(self, serializer):
        try:
            vendor = Vendor.objects.get(user=self.request.user)
        except Vendor.DoesNotExist:
            raise PermissionDenied("You must be a vendor to add products.")
        serializer.save(vendor=vendor)
        # Invalidate relevant caches
        self.invalidate_caches()

    def perform_update(self, serializer):
        product = self.get_object()
        if product.vendor.user != self.request.user:
            raise PermissionDenied("You do not have permission to update this product.")
        serializer.save(vendor=product.vendor)
        # Invalidate relevant caches
        self.invalidate_caches()

    def perform_destroy(self, instance):
        if instance.vendor.user != self.request.user and not self.request.user.is_superuser:
            raise PermissionDenied("You do not have permission to delete this product.")
        instance.delete()
        # Invalidate relevant caches
        self.invalidate_caches()

    def invalidate_caches(self):
        """Invalidate all product-related caches"""
        cache.delete_pattern("product_list_*")
        cache.delete_pattern("product_detail_*")

    @action(detail=False, methods=['get'], url_path='by-vendor/(?P<vendor_id>[^/.]+)', permission_classes=[IsAuthenticated])
    def by_vendor(self, request, vendor_id=None):
        cache_key = f"products_by_vendor_{vendor_id}"
        cached_response = cache.get(cache_key)
        
        if cached_response is not None:
            return Response(cached_response)

        try:
            vendor = Vendor.objects.get(id=vendor_id)
        except Vendor.DoesNotExist:
            return Response({"detail": "Vendor not found."}, status=404)

        products = Product.objects.filter(vendor=vendor)
        serializer = self.get_serializer(products, many=True)
        response_data = serializer.data
        
        cache.set(cache_key, response_data, timeout=settings.CACHE_TTL['product_list'])
        return Response(response_data)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle]

    def get_cache_key(self, request, *args, **kwargs):
        """Generate a unique cache key based on the request parameters"""
        user_id = request.user.id if request.user.is_authenticated else 'anonymous'
        return f"category_list_{user_id}"

    def list(self, request, *args, **kwargs):
        cache_key = self.get_cache_key(request)
        cached_response = cache.get(cache_key)
        
        if cached_response is not None:
            return Response(cached_response)

        response = super().list(request, *args, **kwargs)
        cache.set(cache_key, response.data, timeout=settings.CACHE_TTL['category_list'])
        return response

    def retrieve(self, request, *args, **kwargs):
        cache_key = f"category_detail_{kwargs['pk']}"
        cached_response = cache.get(cache_key)
        
        if cached_response is not None:
            return Response(cached_response)

        response = super().retrieve(request, *args, **kwargs)
        cache.set(cache_key, response.data, timeout=settings.CACHE_TTL['category_list'])
        return response


class VendorCategoryProductsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        user = request.user
        try:
            vendor = Vendor.objects.get(user=user)
        except Vendor.DoesNotExist:
            return Response({"detail": "Vendor not found."}, status=404)

        vendor_category = vendor.categories  

        if not vendor_category:
            return Response({"detail": "Vendor has no category assigned."}, status=400)

        categories = Category.objects.filter(vendor_category=vendor_category)

        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    

class StoreCategoriesViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]  # Allow public access
    
    @action(detail=False, methods=['get'], url_path='by-store/(?P<store_id>[^/.]+)')
    def by_store(self, request, store_id=None):
        try:
            vendor = Vendor.objects.get(id=store_id)
            vendor_category = vendor.categories
            
            if not vendor_category:
                return Response({"detail": "Vendor has no category assigned."}, status=400)
            
            categories = Category.objects.filter(vendor_category=vendor_category)
            serializer = CategorySerializer(categories, many=True)
            return Response(serializer.data)
        
        except Vendor.DoesNotExist:
            return Response({"detail": "Vendor not found."}, status=404)
