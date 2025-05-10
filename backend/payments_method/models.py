from django.db import models
from users.models import User
  
# Create your models here.

class PaymentMethod(models.Model):
    PAYMENT_TYPE_CHOICES = [
        ('credit_card', 'Credit Card'),
        ('paypal', 'PayPal'),
        ('bank_transfer', 'Bank Transfer'),
        ('cash_on_delivery', 'Cash on Delivery'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_methods')
    payment_type = models.CharField(max_length=50, choices=PAYMENT_TYPE_CHOICES)
    provider = models.CharField(max_length=100, blank=True, null=True)
    is_default = models.BooleanField(default=False)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.payment_type}"
