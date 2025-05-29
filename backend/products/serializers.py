from rest_framework import serializers
from .models import Product, Category
from vendors.models import Vendor

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.none(),  # Default empty queryset
        write_only=True
    )
    category_name = serializers.StringRelatedField(source='category', read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', "vendor")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        if 'request' in self.context and not self.context['request'].user.is_superuser:
            user = self.context['request'].user
            try:
                vendor = user.vendor
                if vendor.categories:
                    # Get categories related to the vendor's main category
                    self.fields['category'].queryset = Category.objects.filter(
                        vendor_category=vendor.categories
                    )
            except Vendor.DoesNotExist:
                pass

    def validate(self, attrs):
        if self.instance is None and not attrs.get('image'):
            raise serializers.ValidationError({"image": "This field is required."})
        return attrs
    

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']