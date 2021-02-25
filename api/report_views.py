from datetime import timedelta, datetime

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import *
from inventory.models import *
from dateutil import parser


def summary_orders(orders):
    orders_summary = {
        'total_items': 0,
        'total_revenue': 0,
        'total_mrp': 0,
        'total_cost': 0,
        'total_profit': 0,
    }

    for order in orders:
        orders_summary.update(
            total_items=orders_summary['total_items'] + order.get_cart_items_quantity,
            total_revenue=orders_summary['total_revenue'] + order.get_cart_revenue,
            total_mrp=orders_summary['total_mrp'] + order.get_cart_mrp,
            total_cost=orders_summary['total_cost'] + order.get_cart_cost,
            total_profit=orders_summary['total_profit'] + order.get_cart_profit,
        )

    return orders_summary


def dateRange(start_date, end_date, inclusive=False):
    iteration_range = int((end_date - start_date).days)
    if inclusive is True:
        iteration_range += 1
    for n in range(iteration_range):
        yield start_date + timedelta(n)


class OrdersView(APIView):
    """
        -----Accepts Arguments (order_summary, all_orders, date1, date2)-----

        1. NO ARGUMENT : Only return today's STATS summary

        2. orders_summary: True/False (Loops to generate sum of order_quantity, mrp and amount as order_summary)

        3. all_orders: (True/False)
            - if True (returns all orders if True and ignores all other arguments)

            - if False
                4. date1: Start Date, format Y-M-D or with time eg: 2020-11-05T23:29              //REQUIRED
                5. date2: End Date, format Y-M-D
                            (can be used as range from date1-2
                            if date 2 is empty all records after 1 will be sent)

    """

    @staticmethod
    def get(request):
        if request.GET.get("all_orders") == 'True':
            orders = OrderNew.objects.filter(complete=True)

        elif request.GET.get("all_orders") == 'False' and request.GET.get("date1") and request.GET.get("date2"):
            if request.GET.get("date1") == request.GET.get("date2"):
                date1 = parser.parse(request.GET.get("date1"))
                orders = OrderNew.objects.filter(date_order__year=date1.year, date_order__day=date1.day,
                                              date_order__month=date1.month, complete=True)
            else:
                date1 = parser.parse(request.GET.get("date1"))
                date2 = parser.parse(request.GET.get("date2"))
                print(date1, date2)
                orders = OrderNew.objects.filter(
                    date_order__range=[date1, date2], complete=True)

        elif request.GET.get("all_orders") == 'False' and request.GET.get("date1"):
            date1 = parser.parse(request.GET.get("date1"))
            orders = OrderNew.objects.filter(
                date_order__gt=date1, complete=True)

        else:
            orders = OrderNew.objects.filter(date_order__gt=now(), complete=True)

        # Form Data to return
        orders_serialized = OrderNewSerializer(orders, many=True)

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
#
#     # @staticmethod
#     # def post(request):
#     #     return Response({"request": request.GET.get("damn")})


# @api_view(['GET', 'DELETE'])
# def order_detail(request, pk):
#     try:
#         order = Order.objects.get(pk=pk)
#     except Order.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
#
#     if request.method == 'GET':
#         serializer = OrderSerializer(order)
#         return Response(serializer.data)
#
#     elif request.method == 'DELETE':
#         order.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)


# Fixed -- Changed to New Order Api
class OrdersListView(generics.ListAPIView):
    queryset = OrderNew.objects.filter(complete=True).order_by('-date_order')
    serializer_class = OrderNewSerializer

    def list(self, request, *args, **kwargs):
        temp_queryset = self.get_queryset()
        if request.GET.get("date1") and request.GET.get("date2"):
            date1 = datetime.strptime(request.GET.get("date1"), '%Y-%m-%d')
            date2 = datetime.strptime(request.GET.get("date2"), '%Y-%m-%d') + timedelta(days=1)
            temp_queryset = OrderNew.objects.filter(complete=True).filter(date_order__range=[date1, date2]).order_by(
                '-date_order')

        queryset = self.filter_queryset(temp_queryset)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


# Fixed -- Changed to New Order Items Api
class OrderItemsView(APIView):
    @staticmethod
    def get(request):
        # order_items = OrderItem.objects.filter(order=request.GET.get("order_id"))
        order = OrderNew.objects.get(pk=request.GET.get("order_id"))
        order_items = order.orderitemnew_set.all()
        order_item_serializer = OrderItemNewSerializer(order_items, many=True)
        return Response({'order_items': order_item_serializer.data})


class OrdersChartDataView(APIView):
    @staticmethod
    def get(request):
        if request.GET.get("date1") and request.GET.get("date2"):
            dates, revenue, profit = [], [], []
            for date in dateRange(datetime.strptime(request.GET.get("date1"), '%Y-%m-%d'),
                                  datetime.strptime(request.GET.get("date2"), '%Y-%m-%d'),
                                  inclusive=True):
                orders = OrderNew.objects.filter(date_order__year=date.year, date_order__day=date.day,
                                                 date_order__month=date.month, complete=True)
                order_summary = summary_orders(orders)
                dates.append(date), revenue.append(round(order_summary['total_revenue'], 2))
                profit.append(round(order_summary['total_profit'], 2))
            return Response({'dates': dates, 'revenue': revenue, 'profit': profit})


class ProductCompaniesView(APIView):
    @staticmethod
    def get(request):
        search_term = request.GET.get("query")
        product_companies = ProductCompany.objects.filter(name__contains=search_term)[:10].values_list(flat=True)
        return Response({'suggestions': product_companies})
