from django.shortcuts import render, redirect
from django.http import HttpResponse
from inventory.models import Product, ProductVariation
from accounts.models import User
from .forms import *
import uuid
from api.pos_views import *
from inventory.models import Product, ProductVariation, WishList
from accounts.models import SiteConfiguration


# Create your views here.
def home_page(request):
    # data = ProductVariation.objects.all().filter(product='vineet')
    # print(data)
    # return render(request, 'new/store/page/page-index.html')
    return render(request, 'new/store/home-page.html')


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
    return render(request, 'new/store/user/user-profile.html')


def user_signup(request):
    form = UserSignUpForm()
    if request.method == 'POST':
        form = UserSignUpForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('store_home_page')

    return render(request, 'new/store/user/user-signup.html', {'form': form})


from django.contrib.auth import authenticate, login, logout


def user_login(request):
    # form = UserLoginForm()
    if request.method == 'POST':
        # form = UserLoginForm(request.POST)
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('store_home_page')

    return render(request, 'new/store/user/user-login.html')


def user_logout(request):
    logout(request)
    return redirect('store_home_page')


def items_list(request):
    if request.method == "POST":
        search = request.POST['search']
        return render(request, 'new/store/page/page-items-list.html', {'search' : search})

    else:
        return render(request, 'new/store/page/page-items-list.html')
    # respose = ProductVariationListView()
    # print("hi")
    # print(respose)


def about_us(request):
    return render(request, 'new/store/page/page-about-us.html')


def help_center(request):
    return render(request, 'new/store/page/page-help-center.html')


def item_detail(request):
    # obj = Product.objects.get(product_code=pk)
    # obj1 = ProductVariation.objects.filter(product=obj)
    # print(obj)
    # print(obj1)
    # obj1 = obj1[0]
    # print(obj1.image.url)
    # print(len(obj1))
    # {'datas': obj1, 'data': obj1[0]}
    pk = request.GET.get('pk')
    index = request.GET.get('index')
    quantity = request.GET.get('quantity')
    if index is None:
        index = 0
    if quantity is None:
        quantity = 1
    return render(request, 'new/store/page/page-item-detail.html', {'id': pk, 'index': index, 'quantity': quantity})


def order_cart(request):
    return render(request, 'new/pos/page-order-cart.html')


def order_form(request):
    return render(request, 'new/pos/page-order-form.html')


def user_wishlist(request):
    if request.user.is_authenticated:
        UserWishlist(request)
        return render(request, 'new/store/user/user-wishlist.html')

    else:
        messages = ["Login to view wishlist."]
        return render(request, 'new/store/user/user-login.html', {'messages' : messages})


def store_settings(request):
    if request.user.is_authenticated:
        return render(request, 'new/store/edit-menu.html')

    else:
        return redirect('store_home_page')