from datetime import datetime

from django.core import serializers
from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response

from inventory.models import Order


def dashboard_view(request):
    return render(request, 'reports/dashboard.html', {})


def orders_view(request):
    return render(request, 'reports/orders.html', {})


def orders_datatable_view(request):
    return render(request, 'reports/orders-datatable.html', {})


@api_view(['GET'])
def daily_stats(request):
    date = datetime.today().strftime('%Y-%m-%d')
    if request.method == 'GET':
        completed_orders = Order.objects.filter(complete=True, date_order=date)
        total_quantity = 0
        total_revenue = 0
        total_cost = 0
        for x in completed_orders:
            total_quantity += x.get_cart_items_quantity
            total_revenue += x.get_cart_total
            total_cost += x.get_cart_cost_total
        total_profit = total_revenue - total_cost
        return Response({'date': date, 'quantity': total_quantity, 'revenue': total_revenue, 'cost': total_cost,
                         'profit': total_profit, 'orders': len(completed_orders)})
