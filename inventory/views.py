from django.shortcuts import render

from api.pos_views import ProductCategoryList
from api.serializers import ProductSerializer, ProductCategorySerializer

from inventory.models import Weight_unit, Quantity_unit, ProductCategories
from inventory.helpers import *
import os.path


# Create your views here.
def homeView(request):
    return render(request, 'home.html', {})


def updateInventoryView(request):
    xls_file = request.FILES.get('xlsfile')
    if xls_file:
        filename = xls_file.name
        if filename.endswith('.xls'):
            context = parseSaveXlsFst(xls_file)
        else:
            context = {'message': 'please upload file ending with .xls',
                       'class': 'alert-danger'}
        return render(request, 'update-inventory.html', context)
    return render(request, 'update-inventory.html', {})


def products_view(request):
    weight_unit = Weight_unit
    quantity_unit = Quantity_unit
    return render(request, 'inventory/products-datatable.html',
                  {'weight_unit': weight_unit, 'quantity_unit': quantity_unit})


def add_product_view(request):
    weight_unit = Weight_unit
    quantity_unit = Quantity_unit
    return render(request, 'inventory/add-product.html',
                  {'weight_unit': weight_unit, 'quantity_unit': quantity_unit})
