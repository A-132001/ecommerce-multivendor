from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from cart.views import CartViewSet, CartItemViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r"cart", CartViewSet, basename="cart")
router.register(r"cart-items", CartItemViewSet, basename="cart-item")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("users.urls")),
    path("api/vendors/", include("vendors.urls")),
    path("api/products/", include("products.urls")),
    path('api/payment/', include('payment.urls')),
    path("api/orders/", include("orders.urls")),
    path("api/cart/", include("cart.urls")),




]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
