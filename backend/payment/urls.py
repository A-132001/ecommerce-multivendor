from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, PaymentMethodViewSet

router = DefaultRouter()
router.register('payments', PaymentViewSet, basename='payment')
router.register('methods', PaymentMethodViewSet, basename='paymentmethod')

urlpatterns = [
    path('', include(router.urls)),
]
