from django.shortcuts import render
from django.http import HttpResponse
from inventory.models import Product, ProductVariation


# Create your views here.
def home_page(request):
    # data = ProductVariation.objects.all().filter(product='vineet')
    # print(data)
    return render(request, 'website/store/page-index.html')
