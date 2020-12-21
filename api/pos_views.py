from django.core.exceptions import ObjectDoesNotExist
from django.utils.crypto import get_random_string
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from .serializers import *

from inventory.models import *


class Cart(APIView):
    def get(self, request, format=None):
        order_id = request.GET.get("order_id")
        whatsapp = request.GET.get("whatsapp")
        if whatsapp == 'True' and request.user.is_authenticated:
            try:
                order = Order.objects.get(pk=order_id)
                items = order.orderitem_set.all()
                item_serializer = cart_items_serializer(items, many=True)
                content = {
                    'items': item_serializer.data,
                    'cart_items_quantity': order.get_cart_items_quantity,
                    'cart_total': order.get_cart_revenue,
                    'cart_mrp_total': order.get_cart_mrp,
                    'order_id': order.id
                }
                return Response(content)
            except ObjectDoesNotExist:
                return Response({'error': "no such order or an error occurred"})

        elif order_id is None and request.user.is_authenticated:
            customer = request.user
            order, created = Order.objects.get_or_create(customer=customer, complete=False)

            items = order.orderitem_set.all()
            item_serializer = cart_items_serializer(items, many=True)

            content = {
                'items': item_serializer.data,
                'cart_items_quantity': order.get_cart_items_quantity,
                'cart_total': order.get_cart_revenue,
                'cart_mrp_total': order.get_cart_mrp,
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
                    'cart_total': order.get_cart_revenue,
                    'cart_mrp_total': order.get_cart_mrp,
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
                'cart_mrp_total': '',
                'order_id': ''
            }
            return Response(content)

    def post(self, request, format=None):
        action = request.data['action']
        customer = request.user
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        if action == 'complete' and len(order.orderitem_set.all()) <= 0:
            return Response(
                {"response_type": "toast",
                 "response_text": "No items to complete order. Please add items"}
            )
        elif action == 'complete' and len(order.orderitem_set.all()) > 0:
            order.complete = True
            order.date_order = now()
            order.save()
            return Response(
                {"response_type": "completed",
                 "response_text": "Order Completed, Please print the Receipt or click Finish to refresh page"}
            )
        elif action == 'clear':
            OrderItem.objects.filter(order=request.data['product_code']).delete()
            return Response(
                {"response_type": "completed",
                 "response_text": "All Cart items removed. Start adding products"}
            )
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

            return Response(
                {"response_type": "updated",
                 "response_text": "Item was added/updated"}
            )


class ProductCategoryList(APIView):
    @staticmethod
    def get(request):
        categories = ProductCategories.objects.all()
        category_serializer = ProductCategorySerializer(categories, many=True)
        categories_data = [cat['name'] for cat in category_serializer.data]
        return Response({'categories': categories_data})

    @staticmethod
    def post(request):
        ProductCategories.objects.get_or_create(name=request.data['name'])
        return Response(request.data, status=status.HTTP_201_CREATED)


class ProductCategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = ProductCategories.objects.all()
    serializer_class = ProductCategorySerializer


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all().order_by('-modified_time')
    serializer_class = ProductSerializer


@api_view(['POST'])
def add_product(request):
    if request.method == 'POST':
        product_serializer = ProductSerializer(data=request.data)
        for cat in request.data['category']:
            if cat != "":
                category_object, created = ProductCategories.objects.get_or_create(name=cat)
                if created:
                    print(f'Category - {cat} was added.')
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
        for cat in request.data['category']:
            if cat != "":
                category_object, created = ProductCategories.objects.get_or_create(name=cat)
                if created:
                    print(f'Category - {cat} was added.')
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProductCodeGeneratorView(APIView):
    @staticmethod
    def get(request):
        unique_product_code = get_random_string(6, '0123456789')
        return Response({'unique_product_code': unique_product_code})


@api_view(['GET'])
def search_products(request):
    if request.method == 'GET':
        """
            This is an Temporary search fix until we use POSTGRES database for final build. 
            Once we start using postgres we can use full text search function feature with weights.   
        """
        search_term = request.GET.get("search_term")
        if search_term:
            products_contains = Product.objects.filter(name__contains=search_term)[:10]
            products_starts = Product.objects.filter(name__startswith=search_term)[:3]
            products_code_starts = Product.objects.filter(product_code__startswith=search_term)[:3]
            products = (products_starts | products_contains | products_code_starts)[:10]
        else:
            products = Product.objects.all()[:10]

        product_serializer = ProductSerializer(products, many=True)
        return Response({'products': product_serializer.data})
