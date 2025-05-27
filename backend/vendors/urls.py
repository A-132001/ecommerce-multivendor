from rest_framework.routers import DefaultRouter
from .views import VendorViewSet, VendorCategoryViewSet

router = DefaultRouter()
# Register categories first
router.register(r'categories', VendorCategoryViewSet, basename='vendor-categories')
# Then register vendors with empty prefix - only once
router.register(r'', VendorViewSet, basename='vendor')

urlpatterns = router.urls