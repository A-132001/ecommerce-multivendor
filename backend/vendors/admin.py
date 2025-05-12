# from django.contrib import admin
from django.contrib import admin
from .models import Vendor

# Register your models here.

@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ('store_name', 'user', 'is_verified', 'is_active', 'created_at')
    list_filter = ('is_verified', 'is_active', 'created_at')
    search_fields = ('store_name', 'user__username', 'contact_email', 'contact_phone')
    readonly_fields = ('created_at',)
    fieldsets = (
        (None, {
            'fields': ('user', 'store_name', 'store_description', 'store_logo')
        }),
        ('Contact Info', {
            'fields': ('contact_phone', 'contact_email')
        }),
        ('Status', {
            'fields': ('is_verified', 'is_active', 'created_at')
        }),
    )
