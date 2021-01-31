from django.contrib.auth.models import User, Group
from rest_framework import serializers
from inventory.models import *
from inventory.models_new import ProductNew, ProductVariation


class cart_items_serializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        depth = 1
        fields = '__all__'


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategories
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        depth = 1
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        # depth = 1
        fields = '__all__'


class CartOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        depth = 1
        fields = ('id', 'get_cart_items_quantity', 'get_cart_revenue', 'discount')


class ProductNewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductNew
        fields = '__all__'


class ProductVariationPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariation
        fields = '__all__'


class ProductVariationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariation
        fields = '__all__'
        depth = 1
