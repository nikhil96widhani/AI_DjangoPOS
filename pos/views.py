from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from inventory.models import *


# Create your views here.

@login_required
def pos_homeView(request):
    if request.user.is_authenticated:
        customer = request.user
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        try:
            last_order_id = int(order.id) - 1
        except:
            last_order_id = 0

        cart_items = order.orderitem_set.all()
        context = {
            # 'all_products': all_products,
            'order': order,
            'cart_items': cart_items,
            'payment_mode': Payment_mode,
            'last_order_id': last_order_id
        }
    else:
        context = {
            # 'all_products': all_products,
            'order': [],
            'cart_items': [],
            'last_order_id': 0
        }
    return render(request, 'pos/cart-datatable.html', context)


def receiptView(request, pk):
    try:
        order = Order.objects.get(pk=pk)
        cart_items = order.orderitem_set.all()
        context = {
            'order': order,
            'cart_items': cart_items,
            'discount_savings': order.get_cart_revenue_NoDiscount - order.get_cart_revenue,
            'savings': order.get_cart_mrp - order.get_cart_revenue,
        }
        return render(request, 'pos/receipt.html', context)
    except ObjectDoesNotExist:
        return render(request, 'pos/receipt.html', {'error': "ERROR REASON: "
                                                             "Maybe order doesn't exist,"
                                                             " Check if you have completed the order on POS page,"
                                                             " Check orders page to print the receipt"})


def productLabelView(request, pk):
    try:
        product = Product.objects.get(product_code=pk)
        context = {
            'product': product,
        }
        return render(request, 'pos/product-label.html', context)
    except ObjectDoesNotExist:
        return render(request, 'pos/product-label.html', {'error': "ERROR REASON: "
                                                                   "Product not found with that product id"})


def productExpLabelView(request):
    return render(request, 'pos/product-expiry-label.html', {'date': now().date()})


@login_required
def cart_datatable_view(request):
    all_products = Product.objects.all()[:10]
    if request.user.is_authenticated:
        customer = request.user
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        cart_items = order.orderitem_set.all()
        context = {
            'all_products': all_products,
            'order': order,
            'cart_items': cart_items,
            'payment_mode': Payment_mode
        }
    else:
        context = {
            'all_products': all_products,
            'order': [],
            'cart_items': []
        }
    return render(request, 'pos/pos.html', context)
