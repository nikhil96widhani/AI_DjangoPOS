from django.utils.crypto import get_random_string
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status

from .helper import get_variation_data
from .serializers import *

from inventory.models import *
import json


class ProductCategoryList(APIView):
    @staticmethod
    def get(request):
        categories = ProductCategories.objects.order_by('name')
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
    # request has 2 datas one under overall data of form(excluding image) and one with image data

    overall_data = json.loads(request.data['overall_data'])
    if 'product_data' in overall_data:
        product_data = overall_data['product_data']
    else:
        product_data = None

    variation_data = overall_data['variation_data']
    print(product_data)
    if request.method == 'POST':

        if product_data:
            # product_data = request.data['product_data']
            product_serializer = ProductSerializer(data=product_data)
            print(product_data['category'])
            for cat in product_data['category']:
                print("Hi")
                print(cat)
                if cat != "":
                    category_object, created = ProductCategories.objects.get_or_create(name=cat)
                    if created:
                        print(f'Category - {cat} was added.')
            if product_serializer.is_valid():
                product_serializer.save()
                variation_data['product'] = product_data['product_code']

        variation_data['image'] = request.FILES['image']
        product_variation_serializer = ProductVariationPostSerializer(data=variation_data)
        if product_variation_serializer.is_valid():
            print("image valid")
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
                return Response({'status': 'success', 'response': 'Variation was successfully added.',
                                 'variation_id': product_variation_serializer.data['id']},
                                status=status.HTTP_201_CREATED)
        else:
            print("image invalid")
        return Response(product_variation_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def variation_detail(request, pk):
    print("hi")
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


from rest_framework.pagination import PageNumberPagination


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5
    # page_size_query_param = 'page_size'
    page_query_param = 'pageNumber'
    # max_page_size = 1000


def variation_data(datas):
    var_data = {
    }
    for i in range(len(datas)):
        if i == 0:
            var_data['image'] = datas[i].get_image
        else:
            var_data.update(
                image=var_data['image'] + datas[i].get_image,
            )
    # for data in datas:
    #     var_data['image'] += data.get_image

    return var_data


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all().order_by('-modified_time')
    # print(queryset)
    serializer_class = ProductSerializer
    # Response({
    #     "orders_summary": summary_orders(orders),
    #     "orders": orders_serialized.data,
    # })

    # def list(self, request, *args, **kwargs):
    #     queryset = Product.objects.all().order_by('-modified_time')
    # keys = ["product_data", "variation_data"]
    # data = {key: None for key in keys}
    # for val in queryset:
    #     dat = ProductSerializer(val).data
    #     data["product_data"] += dat
    #     queryset = val.productvariation_set.first()
    #     serializer = ProductVariationSerializer(queryset, many=True)
    #     data["variation_data"] += serializer.data
    # for data in queryset:
    #     setattr(data, data['image'], data.get_image)
    #     # data['image'] = data.get_image
    # print(queryset)
    # serializer = ProductSerializer(queryset, many=True)
    # print(serializer.data[0])
    # i = 0
    # var_data = []
    # for data in queryset:
    #     var_data += data.get_image
    #     i = i + 1
    #
    # print(serializer.data[0])
    # for i in range(len(serializer.data)):
    #     serializer.data[i] = queryset[i].get_image
    # return serializer.data
    # return Response({
    #     'product': serializer.data
    #     # 'extra': variation_data(queryset)
    # })
    # return Response(serializer.data)


class ProductVariationListView(generics.ListAPIView):
    queryset = ProductVariation.objects.all().order_by('-modified_time')
    serializer_class = ProductVariationSerializer
    # pagination_class = StandardResultsSetPagination


# vineet


import django_filters.rest_framework
from .filters import *


class ProductsByCategory(generics.ListAPIView):
    # queryset = Product.objects.filter(category__name__in=['Macrame', 'Cricket Bat'])
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,)
    # filterset_fields = ('category',)
    filterset_class = ProductFilter

    # def get_queryset(self):
    #
    #     query_params = self.request.query_params
    #     categories = query_params.get('categories', None)
    #     # we need data in list to filter by multiple categories
    #     categories = categories.split(",")
    #     if categories == ['null']:
    #         products = Product.objects.all().order_by('-modified_time')
    #     else:
    #         products = Product.objects.filter(category__in=categories)
    #
    #     return products


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


class SomethingAPIView(generics.ListAPIView):
    lookup_url_kwarg = "category"
    serializer_class = ProductSerializer

    # def get_queryset(self):
    #     print("sup again")
    #     category = self.kwargs.get(self.lookup_url_kwarg)
    #     print(category)
    #     if category == "default":
    #         products = Product.objects.all().order_by('-modified_time')
    #
    #     else:
    #         products = Product.objects.filter(category=category)
    #
    #     # products_data = [ProductSerializer(product).data for product in products]
    #
    #     return products
    def get_queryset(self):
        query_params = self.request.query_params
        somethings = query_params.get('something', None)
        print(somethings)
        print(type(somethings))
        somethings = somethings.split(",")
        print(somethings)
        print(type(somethings))
        products = Product.objects.filter(category__in=somethings)
        print(products)
        return products
        # return query_params
