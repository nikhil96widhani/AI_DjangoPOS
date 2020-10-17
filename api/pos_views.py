from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render
from django.utils.crypto import get_random_string
from django.views.generic import View
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, generics, status
from .serializers import *

from accounts.models import User
from inventory.models import *


class Cart(APIView):
    def get(self, request, format=None):
        order_id = request.GET.get("order_id")
        if order_id is None and request.user.is_authenticated:
            customer = request.user
            order, created = Order.objects.get_or_create(customer=customer, complete=False)

            items = order.orderitem_set.all()
            item_serializer = cart_items_serializer(items, many=True)

            content = {
                'items': item_serializer.data,
                'cart_items_quantity': order.get_cart_items_quantity,
                'cart_total': order.get_cart_total,
                'order_id': order.id
            }
            return Response(content)
        elif order_id:
            try:
                order = Order.objects.get(pk=order_id, complete=True)
                items = order.orderitem_set.all()
                item_serializer = cart_items_serializer(items, many=True)
                content = {
                    'items': item_serializer.data,
                    'cart_items_quantity': order.get_cart_items_quantity,
                    'cart_total': order.get_cart_total,
                    'order_id': order.id
                }
                return Response(content)
            except ObjectDoesNotExist:
                return Response({'error': "no such completed order"})
        else:
            content = {
                'items': [],
                'cart_items_quantity': '',
                'cart_total': '',
                'order_id': ''
            }
        return Response(content)

    def post(self, request, format=None):
        action = request.data['action']
        customer = request.user
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        if action == 'complete':
            order.complete = True
            order.save()
        else:
            product_code = request.data['product_code']
            product = Product.objects.get(product_code=product_code)
            orderItem, created = OrderItem.objects.get_or_create(order=order, product=product)

            if action == 'add':
                orderItem.quantity = (orderItem.quantity + 1)
            elif action == 'remove':
                orderItem.quantity = (orderItem.quantity - 1)

            orderItem.save()

            if orderItem.quantity <= 0 or action == 'delete':
                orderItem.delete()

            return Response("Item was added/updated")

        return Response("Order Completed")


class ProductCategoryList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = ProductCategories.objects.all()
    serializer_class = ProductCategorySerializer
    pagination_class = None


class ProductCategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = ProductCategories.objects.all()
    serializer_class = ProductCategorySerializer


# class ProductList(generics.ListCreateAPIView):
#     permission_classes = [IsAuthenticated]
#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer
#     pagination_class = None
#
#
# class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
#     permission_classes = [IsAuthenticated]
#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer


@api_view(['GET', 'POST'])
def product_list(request):
    if request.method == 'GET':
        products = Product.objects.all()
        categories = ProductCategories.objects.all()
        product_serializer = ProductSerializer(products, many=True)
        category_serializer = ProductCategorySerializer(categories, many=True)
        return Response({'products': product_serializer.data, 'product_categories': category_serializer.data})

    elif request.method == 'POST':
        product_serializer = ProductSerializer(data=request.data)
        if product_serializer.is_valid():
            product_serializer.save()
            return Response(product_serializer.data, status=status.HTTP_201_CREATED)
        return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProductCodeGeneratorView(APIView):
    def get(self, request):
        unique_product_code = get_random_string(6, '0123456789')
        return Response({'unique_product_code': unique_product_code})