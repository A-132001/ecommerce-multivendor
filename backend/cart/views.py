from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.exceptions import NotAuthenticated
from rest_framework.permissions import AllowAny
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer

# from rest_framework.permissions import IsAuthenticated


class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

    def get_queryset(self):
        if self.request.user.is_anonymous:
            # Return an empty queryset for unauthenticated users
            return Cart.objects.none()
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            # Associate the cart with the logged-in user
            serializer.save(user=self.request.user)
        else:
            # Handle unauthenticated users (optional)
            serializer.save(user=None)


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return only items in the logged-in user's cart
        return self.queryset.filter(cart__user=self.request.user)


# Create your views here.
