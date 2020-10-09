from django.contrib.auth.models import User, Group
from rest_framework import serializers
from inventory.models import *


class cart_serializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'amount']
