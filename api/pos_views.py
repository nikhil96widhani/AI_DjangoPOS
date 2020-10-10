from django.shortcuts import render
from django.views.generic import View
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, generics
from .serializers import cart_serializer, ProductCategoriesSerializer, ProductSerializer

from accounts.models import User
from inventory.models import *


class Cart(APIView):
    def get(self, request, format=None):
        if request.user.is_authenticated:
            customer = request.user
            order, created = Order.objects.get_or_create(customer=customer, complete=False)
            items = order.orderitem_set.all()
            print(order.get_cart_items_quantity)
            serializer = cart_serializer(items, many=True)

            print(items)
            content = {
                'items': serializer.data,
            }
        else:
            content = {
                'items': [],
            }
        return Response(content)


class ProductCategoryList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = ProductCategories.objects.all()
    serializer_class = ProductCategoriesSerializer


class ProductCategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = ProductCategories.objects.all()
    serializer_class = ProductCategoriesSerializer


class ProductList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
