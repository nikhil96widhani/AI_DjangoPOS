from django.contrib.auth.models import User, Group
from rest_framework import serializers
from inventory.models import *


class cart_items_serializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        depth = 1
        fields = '__all__'


class ProductCategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategories
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
