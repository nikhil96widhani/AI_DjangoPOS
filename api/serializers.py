from django.contrib.auth.models import User, Group
from rest_framework import serializers
from inventory.models import *


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


class order_serializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        # depth = 1
        fields = ('id', 'date_order', 'complete', 'get_cart_items_quantity', 'get_cart_cost_total',
                  'get_cart_total', 'get_cart_mrp_total', 'get_cart_revenue')
