from django.contrib import admin
from .models import Product, Category
from vendors.models import Vendor

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at', 'updated_at', 'vendor_category')
    search_fields = ('name',)
    list_filter = ('created_at',)
    ordering = ('-created_at',)
    list_per_page = 10
    fieldsets = (
        (None, {
            'fields': ('name', 'vendor_category')
        }),
    )
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.prefetch_related('products')
        
    def get_products(self, obj):
        return ", ".join([product.name for product in obj.products.all()]) if obj.products.exists() else "No products"
    get_products.short_description = 'Products'
    get_products.admin_order_field = 'products'
    
    def has_add_permission(self, request):
        return request.user.is_superuser

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'vendor', 'price', 'stock', 'category', 'created_at', 'updated_at')
    search_fields = ('name', 'vendor__name')
    list_filter = ('category', 'is_active')
    ordering = ('-created_at',)
    list_per_page = 10
    fieldsets = (
        (None, {
            'fields': ('name', 'vendor', 'description', 'price', 'stock', 'category', 'image', 'discount', 'is_active')
        }),
    )
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        # Filter categories based on vendor's store category
        if db_field.name == "category":
            if request.user.is_superuser:
                # Superusers see all categories
                return super().formfield_for_foreignkey(db_field, request, **kwargs)
            
            try:
                vendor = Vendor.objects.get(user=request.user)
                if vendor.categories:
                    kwargs["queryset"] = Category.objects.filter(vendor_category=vendor.categories)
                else:
                    kwargs["queryset"] = Category.objects.none()
            except Vendor.DoesNotExist:
                kwargs["queryset"] = Category.objects.none()
        
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    
    def has_add_permission(self, request):
        return request.user.is_superuser or request.user.groups.filter(name='Vendors').exists()

admin.site.register(Category, CategoryAdmin)
admin.site.register(Product, ProductAdmin)