from django.shortcuts import render


# Create your views here.
def orders_view(request):
    return render(request, 'reports/orders.html', {})
