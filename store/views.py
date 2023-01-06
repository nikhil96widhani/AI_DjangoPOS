from django.shortcuts import render, redirect
from django.http import HttpResponse
from inventory.models import Product, ProductVariation
from accounts.models import User
from .forms import CustomerCreationForm
import uuid
from api.pos_views import *
from inventory.models import Product, ProductVariation
# Create your views here.
def home_page(request):
    # data = ProductVariation.objects.all().filter(product='vineet')
    # print(data)
    return render(request, 'new/store/page-index.html')


def user_profile(request):
    # form = CustomerCreationForm()
    # if request.method == 'POST':
    #     form = CustomerCreationForm(request.POST)
    #     if form.is_valid():
    #         print("hi")
    #         form.save()
    #         # obj.username = uuid.uuid4()
    #         # obj.save()
    #
    #         return redirect('store_home_page')
    #
    # print("Hi")
    return render(request, 'new/user-profile.html')


def user_signup(request):
    form = CustomerCreationForm()
    if request.method == 'POST':
        form = CustomerCreationForm(request.POST)
        if form.is_valid():
            print("hi")
            form.save()
            # obj.username = uuid.uuid4()
            # obj.save()

            return redirect('store_home_page')

    print("Hi")
    return render(request, 'new/user-signup.html', {'form': form})


def items_list(request):
    respose = ProductVariationListView()
    print("hi")
    print(respose)
    return render(request, 'new/store/page-items-list.html')


def item_detail(request, pk):
    # obj = Product.objects.get(product_code=pk)
    # obj1 = ProductVariation.objects.filter(product=obj)
    # print(obj)
    # print(obj1)
    # obj1 = obj1[0]
    # print(obj1.image.url)
    # print(len(obj1))
    # {'datas': obj1, 'data': obj1[0]}
    print(pk)
    return render(request, 'new/store/page-item-detail.html', {'id': pk})


def order_cart(request):
    return render(request, 'new/pos/page-order-cart.html')


def order_form(request):
    return render(request, 'new/pos/page-order-form.html')