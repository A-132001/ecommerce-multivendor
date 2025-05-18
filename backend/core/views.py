from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import SiteSetting
from django.core.cache import cache

class CurrencyView(APIView):
    def get(self, request):
        currency = cache.get("site_currency")
        if currency:
            return Response({"currency": currency})
        
        site_setting = SiteSetting.objects.first()
        if site_setting and site_setting.currency:
            currency = site_setting.currency
            cache.set("site_currency", currency, timeout=60 * 60 * 24 * 7)  # Cache for 7 days
            return Response({"currency": currency})
        else:
            return Response({"error": "Site settings not configured."}, status=status.HTTP_404_NOT_FOUND)
