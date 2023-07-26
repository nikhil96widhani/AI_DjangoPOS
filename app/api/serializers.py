from rest_framework import serializers
from inventory.models import *
from inventory.models import Product, ProductVariation, StockBill, StockBillItems, Order, OrderItem
from accounts.models import Expense, User


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategories
        fields = '__all__'


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'phone', 'firstname', 'lastname', 'is_customer']


# --------------NEW


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        # depth = 1
        fields = (
            'product_code', 'name', 'brand', 'category', 'rack_number', 'modified_time', 'description', 'get_image',
            'get_mrp', 'get_discount_price', 'min_mrp')
        # fields = '__all__'


class ProductVariationPostSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(
        required=False, max_length=None, use_url=True, allow_null=True
    )

    class Meta:
        model = ProductVariation
        # fields = '__all__'
        fields = (
            'id', 'image', 'variation_name', 'cost', 'mrp', 'discount_price', 'discount_percentage', 'quantity_unit',
            'quantity', 'weight', 'weight_unit', 'expiry_date', 'modified_time', 'colour', 'orders', 'product',
            'other_variations')


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
    customer = UserRegistrationSerializer()

    class Meta:
        model = Order
        depth = 1
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        customer_data = representation.get('customer')

        if customer_data is None:
            # If the customer is None, replace the customer_data with a dictionary containing 'NONE' values
            customer_data = {
                'id': None,
                'email': None,
                'phone': None,
                'firstname': None,
                'lastname': None,
                'is_customer': None
            }

        representation['customer'] = customer_data
        return representation


class OrderItemSerializer(serializers.ModelSerializer):
    # variation = ProductVariationSerializer(read_only=True)
    class Meta:
        model = OrderItem
        # depth = 1
        fields = ('id', 'product_code', 'name', 'weight', 'weight_unit', 'cost', 'mrp', 'discount_price', 'amount',
                  'quantity', 'date_added', 'order', 'product', 'variation', 'discount', 'get_variation_name')


class CartOrderSerializer(serializers.ModelSerializer):
    customer = UserRegistrationSerializer()

    class Meta:
        model = Order
        depth = 1
        fields = ('id', 'get_cart_items_quantity', 'get_cart_revenue', 'discount', 'customer')


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'
