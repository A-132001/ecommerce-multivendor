from django.contrib import admin
from .models import Cart, CartItem

# عرض Cart و CartItem في الـ admin
admin.site.register(Cart)
admin.site.register(CartItem)
