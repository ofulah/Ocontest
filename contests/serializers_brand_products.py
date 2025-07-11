from rest_framework import serializers
from accounts.models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image', 'status', 'stock_quantity']
        read_only_fields = ['id', 'created_at', 'updated_at']
