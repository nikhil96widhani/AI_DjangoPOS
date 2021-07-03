from django.utils.crypto import get_random_string
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status

from .helper import get_variation_data
from .serializers import *

from inventory.models import *


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


class ProductCodeGeneratorView(APIView):
    @staticmethod
    def get(request):
        unique_product_code = get_random_string(6, '0123456789')
        return Response({'unique_product_code': unique_product_code})


@api_view(['POST'])
def add_product_with_variation(request):
    variation_data = request.data['variation_data']
    if request.method == 'POST':
        # Product Save
        if 'product_data' in request.data.keys():
            product_data = request.data['product_data']
            product_serializer = ProductSerializer(data=product_data)
            print(product_data['category'])
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
                ProductVariation.objects.get(product=variation_data['product'],
                                             cost=variation_data['cost'],
                                             mrp=variation_data['mrp'],
                                             discount_price=variation_data['discount_price'],
                                             weight=variation_data['weight'],
                                             expiry_date=variation_data['expiry_date'])
                # variation_obj.quantity += int(quantity)
                # variation_obj.save()
                return Response({'status': 'error',
                                 'response': 'Variation with these values already exists!'})
            except ProductVariation.DoesNotExist:
                product_variation_serializer.save()
                return Response({'status': 'success', 'response': 'Variation was successfully added.'},
                                status=status.HTTP_201_CREATED)

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
        product = Product.objects.get(pk=product_data['product_code'])
        product_serializer = ProductSerializer(product, data=product_data)
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
            product = Product.objects.get(pk=variation.product.product_code)
            product.delete()
        except ProductVariation.MultipleObjectsReturned:
            variation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    # permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductVariationListView(generics.ListAPIView):
    queryset = ProductVariation.objects.all().order_by('-modified_time')
    serializer_class = ProductVariationSerializer


@api_view(['GET'])
def variations_data_using_product_code(request):
    try:
        Product.objects.get(pk=request.GET.get('product_code'))
    except Product.DoesNotExist:
        return Response({'product_exists': False})

    if request.GET.get('action') == 'product_check':
        return Response({'product_exists': True})

    elif request.GET.get('action') == 'product_variation_data':
        product_code = request.GET.get('product_code')
        return Response(get_variation_data(product_code))
