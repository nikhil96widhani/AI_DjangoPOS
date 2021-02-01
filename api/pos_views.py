from django.core.exceptions import ObjectDoesNotExist
from django.db.models import F
from django.utils.crypto import get_random_string
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
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

    @staticmethod
    def post(request):
        action = request.data['action']
        customer = request.user
        order, created = Order.objects.get_or_create(customer=customer, complete=False)

        response = {"response_type": action,
                    "response_text": f"{str(action).title()} product was successful."}

        try:
            product_code = request.data['product_code']
        except KeyError:
            product_code = None

        if product_code:
            product = Product.objects.get(product_code=product_code)
            order_item, created = OrderItem.objects.get_or_create(order=order, product=product)
            if action == 'add':
                order_item.quantity = (order_item.quantity + 1)
            elif action == 'remove':
                order_item.quantity = (order_item.quantity - 1)
                if order_item.quantity <= 0:
                    order_item.delete()
                    return Response(response)
            elif action == 'delete':
                order_item.delete()
                return Response(response)
            order_item.save()
            return Response(response)
        else:
            if action == 'add_quantity_by_input':
                orderitem_id = request.data['orderitem_id']
                orderitem_quantity = request.data['quantity_by_id']
                order_item = OrderItem.objects.get(id=orderitem_id)
                if orderitem_quantity:
                    if int(orderitem_quantity) > 0:
                        order_item.quantity = int(orderitem_quantity)
                        order_item.save()
                    else:
                        order_item.delete()
                else:
                    order_item.delete()
                return Response(response)
            if action == 'edit_mrp':
                orderitem_id = request.data['orderitem_id']
                orderitem_mrp = request.data['value']
                print(orderitem_id, orderitem_mrp)
                order_item = OrderItem.objects.get(id=orderitem_id)
                if orderitem_mrp:
                    print('works')
                    order_item.mrp = float(orderitem_mrp)
                    order_item.save()
                return Response(response)
            if action == 'edit_discount_price':
                orderitem_id = request.data['orderitem_id']
                orderitem_dp = request.data['value']
                order_item = OrderItem.objects.get(id=orderitem_id)
                if orderitem_dp:
                    order_item.discount_price = float(orderitem_dp)
                    order_item.save()
                return Response(response)
            if action == 'add_quantity':
                orderitem_id = request.data['orderitem_id']
                order_item = OrderItem.objects.get(id=orderitem_id)
                order_item.quantity = (order_item.quantity + 1)
                order_item.save()
                return Response(response)
            if action == 'remove_quantity':
                orderitem_id = request.data['orderitem_id']
                order_item = OrderItem.objects.get(id=orderitem_id)
                order_item.quantity = (order_item.quantity - 1)
                if order_item.quantity <= 0:
                    order_item.delete()
                    return Response(response)
                order_item.save()
                return Response(response)
            if action == 'delete_byId':
                orderitem_id = request.data['orderitem_id']
                order_item = OrderItem.objects.get(id=orderitem_id)
                order_item.delete()
                return Response(response)
            if action == 'quick_add':
                name = request.data['name']
                discount_price = request.data['discount_price']
                quantity = request.data['quantity']
                a = OrderItem.objects.create(order=order, product=None, quantity=int(quantity), product_name=name,
                                             discount_price=float(discount_price))
                a.save()
                return Response(response)

    @staticmethod
    def put(request):
        # print(request.data)
        action = request.data['action']
        customer = request.user
        order, created = Order.objects.get_or_create(customer=customer, complete=False)

        if action == 'complete' and len(order.orderitem_set.all()) <= 0:
            return Response(
                {"response_type": "completed",
                 "response_text": "No items to complete order. Please add items"}
            )
        elif action == 'complete' and len(order.orderitem_set.all()) > 0:
            order.complete = True
            order.payment_mode = request.data['payment-mode']
            order.date_order = now()
            order.save()
            return Response(
                {"response_type": "completed",
                 "response_text": "Order Completed, Please print the Receipt or click Finish to refresh page"}
            )
        elif action == 'clear':
            OrderItem.objects.filter(order=request.data['product_code']).delete()
            return Response(
                {"response_type": "updated",
                 "response_text": "All Cart items removed. Start adding products"}
            )
        elif action == 'apply_discount':
            value = request.data['value']
            is_percentage = request.data['is_percentage']

            discount, created = Discount.objects.get_or_create(value=int(value), is_percentage=is_percentage)
            order.discount = discount
            order.save()
            return Response(
                {"response_type": "Applied",
                 "response_text": "Discount Applied"}
            )
        elif action == 'remove_order_discount':
            order.discount = None
            order.save()
            return Response(
                {"response_type": "Applied",
                 "response_text": "Discount Applied"}
            )


class CartListView(generics.ListAPIView):
    queryset = Order.objects.none()
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        customer = request.user
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        order_items = order.orderitem_set.all()
        queryset = self.filter_queryset(order_items)
        serializer = self.get_serializer(reversed(queryset), many=True)
        return Response({'order_items': serializer.data, 'order': CartOrderSerializer(order).data})


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
            products_contains = Product.objects.filter(name__contains=search_term)[:8]
            products_starts = Product.objects.filter(name__startswith=search_term)[:3]
            products_code_starts = Product.objects.filter(product_code__startswith=search_term)[:3]
            products = (products_starts | products_contains | products_code_starts)[:8]
        else:
            products = Product.objects.all()[:8]

        product_serializer = ProductSerializer(products, many=True)
        return Response({'products': product_serializer.data})


@api_view(['POST'])
def add_product_with_variation(request):
    variation_data = request.data['variation_data']
    if request.method == 'POST':
        # Product Save
        if 'product_data' in request.data.keys():
            product_data = request.data['product_data']
            product_serializer = ProductNewSerializer(data=product_data)
            for cat in product_data['category']:
                if cat != "":
                    category_object, created = ProductCategories.objects.get_or_create(name=cat)
                    if created:
                        print(f'Category - {cat} was added.')
            if product_serializer.is_valid():
                product_serializer.save()
                variation_data['product'] = product_data['product_code']

        product_variation_serializer = ProductVariationPostSerializer(data=variation_data)
        if product_variation_serializer.is_valid():
            try:
                variation_obj = ProductVariation.objects.get(product=variation_data['product'],
                                                             cost=variation_data['cost'], mrp=variation_data['mrp'])
                variation_obj.quantity += variation_data['quantity']
                variation_obj.save()
                return Response(ProductVariationPostSerializer(variation_obj).data, status=status.HTTP_201_CREATED)
            except ProductVariation.DoesNotExist:
                product_variation_serializer.save()
                return Response(product_variation_serializer.data, status=status.HTTP_201_CREATED)

        return Response(product_variation_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def variation_detail(request, pk):
    try:
        variation = ProductVariation.objects.get(pk=pk)
    except ProductVariation.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        variation_serializer = ProductVariationSerializer(variation)
        return Response(variation_serializer.data)

    elif request.method == 'PUT':
        product_data = request.data['product_data']
        variation_data = request.data['variation_data']

        # Product Update
        product = ProductNew.objects.get(pk=product_data['product_code'])
        product_serializer = ProductNewSerializer(product, data=product_data)
        for cat in product_data['category']:
            if cat != "":
                category_object, created = ProductCategories.objects.get_or_create(name=cat)
                if created:
                    print(f'Category - {cat} was added.')
        if product_serializer.is_valid():
            product_serializer.save()

        # Variation Update
        variation_serializer = ProductVariationPostSerializer(variation, data=variation_data, partial=True)
        if variation_serializer.is_valid():
            variation_serializer.save()
            return Response(ProductVariationSerializer(variation).data)
        return Response(variation_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        try:
            ProductVariation.objects.get(product=variation.product.product_code)
            product = ProductNew.objects.get(pk=variation.product.product_code)
            product.delete()
        except ProductVariation.MultipleObjectsReturned:
            variation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    # permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = ProductNew.objects.all()
    serializer_class = ProductNewSerializer


class ProductVariationListView(generics.ListAPIView):
    queryset = ProductVariation.objects.all()
    serializer_class = ProductVariationSerializer


@api_view(['GET'])
def variations_data_using_product_code(request):
    try:
        ProductNew.objects.get(pk=request.data['product_code'])
    except ProductNew.DoesNotExist:
        return Response({'product_exists': False})

    if request.data['action'] == 'product_check':
        return Response({'product_exists': True})

    elif request.data['action'] == 'product_variation_data':
        variations = ProductVariation.objects.filter(product=request.data['product_code'])
        variation_data = [ProductVariationPostSerializer(variation).data for variation in variations]

        product = ProductNew.objects.get(pk=request.data['product_code'])
        product_data = ProductNewSerializer(product).data

        return Response({'product_data': product_data, 'variation_data': variation_data})
