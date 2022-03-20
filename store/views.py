from django.shortcuts import render, redirect
from django.http import HttpResponse
from inventory.models import Product, ProductVariation
from accounts.models import User
from .forms import CustomerCreationForm
import uuid

# Create your views here.
def home_page(request):
    # data = ProductVariation.objects.all().filter(product='vineet')
    # print(data)
    return render(request, 'new/store/page-index.html')


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
