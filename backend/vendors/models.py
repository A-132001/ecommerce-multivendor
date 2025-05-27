from django.db import models
from django.conf import settings

class VendorCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)

    def __str__(self):
        return self.name

def get_upload_path(instance, filename):
    return f'vendor_logos/{instance.user.id}/{filename}'

class Vendor(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    store_name = models.CharField(max_length=255, unique=True)
    store_description = models.TextField()
    store_logo = models.ImageField(upload_to=get_upload_path, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    contact_phone = models.CharField(max_length=15)
    contact_email = models.EmailField()
    categories = models.ForeignKey(VendorCategory, on_delete=models.SET_NULL, related_name='vendors', null=True, blank=True)

    def __str__(self): 
        return self.store_name