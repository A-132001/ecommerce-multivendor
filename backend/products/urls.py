from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, VendorCategoryProductsViewSet, StoreCategoriesViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'vendor-categories-products', VendorCategoryProductsViewSet, basename='vendor-categories-products')
router.register(r'store-categories', StoreCategoriesViewSet, basename='store-categories')
urlpatterns = [
    path('', include(router.urls)),
]