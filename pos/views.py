from django.shortcuts import render
from inventory.models import *


# Create your views here.
def pos_homeView(request):
    all_products = Product.objects.all()
    if request.user.is_authenticated:
        customer = request.user
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        cart_items = order.orderitem_set.all()
        context = {
            'all_products': all_products,
            'order': order,
            'cart_items': cart_items
        }
    else:
        context = {
            'all_products': all_products,
            'order': [],
            'cart_items': []
        }
    return render(request, 'pos/pos.html', context)
