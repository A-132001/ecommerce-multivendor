from django.utils import timezone
from django.contrib import admin
from .models import Vendor
from .tasks import send_vendor_approval_email, send_vendor_rejection_email
from django.http import HttpResponse

@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ('store_name', 'user', 'is_verified', 'is_active', 'created_at')
    list_filter = ('is_verified', 'is_active')
    search_fields = ('store_name', 'user__username')
    ordering = ('-created_at',)

    
    actions = ['approve_vendors', 'reject_vendors']

    def approve_vendors(self, request, queryset):
        for vendor in queryset:
            if not vendor.is_verified:
                vendor.is_verified = True
                vendor.verified_at = timezone.now()
                vendor.save()

                # Send approval email
                send_vendor_approval_email(vendor.id)

        self.message_user(request, f"{queryset.count()} vendor(s) approved and notified.")
    approve_vendors.short_description = "Approve selected vendors"

    def reject_vendors(self, request, queryset):
        for vendor in queryset:
            if vendor.is_verified:
                vendor.is_verified = False
                vendor.rejection_reason = "Rejected via admin panel"
                vendor.save()

                # Send rejection email
                send_vendor_rejection_email(vendor.id, vendor.rejection_reason)

        self.message_user(request, f"{queryset.count()} vendor(s) rejected and notified.")
    reject_vendors.short_description = "Reject selected vendors"

