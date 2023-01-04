from django.shortcuts import render
from django.http import HttpResponse
from inventory.models import Product, ProductVariation


# Create your views here.
def home_page(request):
    # data = ProductVariation.objects.all().filter(product='vineet')
    # print(data)
    return render(request, 'new/store/page-index.html')


def items_list(request):

    return render(request, 'new/store/page-items-list.html')


def item_detail(request):

    return render(request, 'new/store/page-item-detail.html')