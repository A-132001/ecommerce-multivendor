from rest_framework.routers import DefaultRouter

from .views import VendorViewSet, VendorAdminViewSet

router = DefaultRouter()

router.register(r'', VendorViewSet, basename='vendor')
router.register(r'admin', VendorAdminViewSet, basename='vendor-admin')

urlpatterns = router.urls 