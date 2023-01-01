from rest_framework import serializers
from inventory.models import *
from inventory.models import Product, ProductVariation, StockBill, StockBillItems, Order, OrderItem


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategories
        fields = '__all__'


# --------------NEW


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class ProductVariationPostSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(
        max_length=None, use_url=True,
    )

    class Meta:
        model = ProductVariation
        fields = '__all__'


class ProductVariationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariation
        fields = '__all__'
        depth = 2


class StockBillItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockBillItems
        depth = 0
        fields = '__all__'


class StockBillSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockBill
        fields = '__all__'
        depth = 1


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
