from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import PaymentMethod
from .serializers import PaymentMethodSerializer

# Create your views here.


class PaymentMethodViewSet(viewsets.ModelViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return PaymentMethod.objects.filter(user=self.request.user)
