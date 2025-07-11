from rest_framework import generics, status, permissions
from rest_framework.response import Response
from accounts.models import BrandProfile, Product
from django.shortcuts import get_object_or_404
from .serializers_brand_products import ProductSerializer

class BrandProductListView(generics.ListAPIView):
    """
    View to list all products for a specific brand
    Public endpoint - no authentication required
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]  # Allow public access
    
    def get_queryset(self):
        brand_id = self.kwargs.get('brand_id')
        brand = get_object_or_404(BrandProfile, user_id=brand_id)
        return Product.objects.filter(brand=brand, status='available')  # Only show available products
