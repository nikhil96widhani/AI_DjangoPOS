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
        # fields = '__all__'
        fields = ('id', 'product_code', 'name', 'cost', 'mrp', 'discount_price',
                  'discount_percentage', 'stock', 'quantity_unit', 'weight', 'weight_unit',
                  'expiry_date', 'is_new_variation', 'stock_bill', 'product_variation', 'get_cost')


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
