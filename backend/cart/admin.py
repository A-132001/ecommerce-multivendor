from django.contrib import admin
from .models import Cart, CartItem


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ["user", "is_active", "created_at", "updated_at"]
    search_fields = ["user__username", "user__email"]
    list_filter = ["is_active", "created_at"]




@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ["cart", "product", "quantity", "created_at"]
    search_fields = ["cart__user__username", "product__name"]
    list_filter = ["created_at"]
