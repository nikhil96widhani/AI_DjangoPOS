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
    # category = serializers.SerializerMethodField()
    # quantity = serializers.SerializerMethodField()
    # weight = serializers.SerializerMethodField()

    # def get_category(self, product):
    #     return ', '.join([str(cat) for cat in product.category.all()])

    # @staticmethod
    # def get_quantity(product):
    #     if product.quantity_unit is not None:
    #         return f'{product.quantity} {product.quantity_unit}'
    #     return product.quantity
    #
    # @staticmethod
    # def get_weight(product):
    #     if product.weight is not None:
    #         return f'{product.weight} {product.weight_unit}'
    #     return product.weight

    class Meta:
        model = Product
        fields = '__all__'
