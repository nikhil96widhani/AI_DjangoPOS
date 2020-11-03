from django.shortcuts import render

from api.pos_views import ProductCategoryList, ProductListView
from api.serializers import ProductSerializer, ProductCategorySerializer

# Create your views here.
from inventory.models import Weight_unit, Quantity_unit, ProductCategories


def homeView(request):
    return render(request, 'home.html', {})


def products_view(request):
    products = ProductListView.as_view()(request=request).data
    return render(request, 'inventory/products-datatable.html', {'products': products})


def add_product_view(request):
    weight_unit = Weight_unit
    quantity_unit = Quantity_unit
    categories = [(i.id, i.name) for i in ProductCategories.objects.all()]
    print(categories)
    return render(request, 'inventory/add-product.html',
                  {'weight_unit': weight_unit, 'quantity_unit': quantity_unit, 'categories': categories})
