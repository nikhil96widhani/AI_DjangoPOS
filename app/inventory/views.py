from django.shortcuts import render

from django.contrib.auth.decorators import login_required
from django.core.exceptions import MultipleObjectsReturned
from inventory.models import Weight_unit, Quantity_unit, StockBill


# Create your views here.
# def homeView(request):
#     return render(request, 'home.html', {})


def updateInventoryView(request):
    xls_file = request.FILES.get('xlsfile')
    if xls_file:
        filename = xls_file.name
        if filename.endswith('.xls'):
            # context = parseSaveXlsFst(xls_file)
            context = {}
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


# def add_product_view(request):
#     weight_unit = Weight_unit
#     quantity_unit = Quantity_unit
#     return render(request, 'inventory/add-product.html',
#                   {'weight_unit': weight_unit, 'quantity_unit': quantity_unit})


@login_required
def updateInventoryByBill(request):
    if request.user.is_authenticated:
        def getCreateOrder_Patch(user):
            try:
                billl, created = StockBill.objects.get_or_create(user=user, complete=False)
                return billl
            except MultipleObjectsReturned:
                bills = StockBill.objects.filter(customer=user, complete=False)
                bills.delete()
                return getCreateOrder_Patch(user)

        bill = getCreateOrder_Patch(request.user)

        context = {
            'bill': bill,
        }
    else:
        context = {
            'order': [],
        }
    return render(request, 'inventory/update_inventory_by_bill.html', context)


def stock_bills_datatable_view(request):
    return render(request, 'inventory/stock-bills-datatable.html', {})
