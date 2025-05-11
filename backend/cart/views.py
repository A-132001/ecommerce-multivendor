from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.exceptions import NotAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework import serializers
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

    def get_queryset(self):
        if self.request.user.is_authenticated:
            # Return only items in the logged-in user's cart
            return self.queryset.filter(cart__user=self.request.user)
        # Return an empty queryset for unauthenticated users
        return CartItem.objects.none()

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            # Get or create the active cart for the logged-in user
            cart, created = Cart.objects.get_or_create(
                user=self.request.user, is_active=True
            )
            serializer.save(cart=cart)
        else:
            # Raise an error for unauthenticated users
            raise serializers.ValidationError(
                {"detail": "You must be logged in to add items to the cart."}
            )


# Create your views here.
