from django.urls import path
from .views import CurrencyView

urlpatterns = [
    path('currency/', CurrencyView.as_view(), name='currency-api'),
]