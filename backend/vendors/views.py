from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Vendor
from .serializers import VendorSerializer


class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = VendorSerializer