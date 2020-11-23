from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *
from inventory.models import *
from django.utils import timezone
from django.db.models import Sum
import json


def summary_orders(orders):
    orders_summary = {
        'total_items': 0,
        'total_amount': 0,
        'total_mrp': 0,
        'total_cost': 0,
        'total_revenue': 0,
    }

    for order in orders:
        orders_summary.update(
            total_items=orders_summary['total_items'] + order.get_cart_items_quantity,
            total_amount=orders_summary['total_amount'] + order.get_cart_total,
            total_mrp=orders_summary['total_amount'] + order.get_cart_mrp_total,
            total_cost=orders_summary['total_cost'] + order.get_cart_cost_total,
            total_revenue=orders_summary['total_revenue'] + order.get_cart_revenue,
        )

    return orders_summary


class OrdersView(APIView):
    """
        -----Accepts Arguments (order_summary, all_orders, date1, date2)-----

        1. NO ARGUMENT : Only return today's STATS summary

        2. orders_summary: True/False (Loops to generate sum of order_quantity, mrp and amount as order_summary)

        3. all_orders: (True/False)
            - if True (returns all orders if True and ignores all other arguments)

            - if False
                4. date1: Start Date, format Y-M-D                                                  //REQUIRED
                5. date2: End Date, format Y-M-D
                            (can be used as range from date1-2
                            if date 2 is empty all records after 1 will be sent)

    """

    @staticmethod
    def get(request):
        if request.GET.get("all_orders") == 'True':
            orders = Order.objects.filter(complete=True)

        elif request.GET.get("all_orders") == 'False' and request.GET.get("date1") and request.GET.get("date2"):
            if request.GET.get("date1") == request.GET.get("date2"):
                date1 = timezone.datetime.strptime(request.GET.get("date1"), '%Y-%m-%d')
                orders = Order.objects.filter(date_order__year=date1.year, date_order__day=date1.day,
                                              date_order__month=date1.month, complete=True)
            else:
                date1 = timezone.datetime.strptime(request.GET.get("date1"), '%Y-%m-%d')
                date2 = timezone.datetime.strptime(request.GET.get("date2"), '%Y-%m-%d')
                orders = Order.objects.filter(
                    date_order__range=[date1.replace(hour=0, minute=0, second=0),
                                       date2.replace(hour=0, minute=0, second=0)
                                       ], complete=True)

        elif request.GET.get("all_orders") == 'False' and request.GET.get("date1"):
            date1 = timezone.datetime.strptime(request.GET.get("date1"), '%Y-%m-%d')
            orders = Order.objects.filter(
                date_order__gt=date1.replace(hour=0, minute=0, second=0), complete=True)

        else:
            orders = Order.objects.filter(date_order__gt=now().replace(hour=0, minute=0, second=0), complete=True)

        # Form Data to return
        orders_serialized = order_serializer(orders, many=True)

        if request.GET.get("only_summary") == 'True':
            return Response(
                {
                    "orders_summary": summary_orders(orders),
                })
        else:
            return Response({
                "orders_summary": summary_orders(orders),
                "orders": orders_serialized.data,
            })

    # @staticmethod
    # def post(request):
    #     return Response({"request": request.GET.get("damn")})
