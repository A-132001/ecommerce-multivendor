from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, PaymentMethodViewSet, PaymentView
from .views import pay_with_vodafone_cash ,paymob_webhook
from . import views
router = DefaultRouter()
router.register('payments', PaymentViewSet, basename='payment')
router.register('methods', PaymentMethodViewSet, basename='paymentmethod')

urlpatterns = [
    path('', include(router.urls)),
    path("pay/vodafone/", pay_with_vodafone_cash, name="vodafone-pay"),
    path('paymob-webhook/', paymob_webhook, name='paymob-webhook'),
    path('', PaymentView.as_view(), name='payments'),
]
