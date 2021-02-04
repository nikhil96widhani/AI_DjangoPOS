from django.core.exceptions import ObjectDoesNotExist
from django.db.models import F
from django.utils.crypto import get_random_string
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from .serializers import *

from inventory.models_new import *


class StockBillApiView(APIView):
    def get(self, request, format=None):
        bill_id = request.GET.get("bill_id")
        if bill_id is None and request.user.is_authenticated:
            customer = request.user
            bill = StockBill.objects.get(user=customer, complete=False)

            bill_items = bill.stockbillitems_set.all()
            bill_item_serializer = bill_items_serializer(bill_items, many=True)

            content = {
                'bill_items': bill_item_serializer.data,
                'bill_items_quantity': bill.get_bill_items_quantity,
                'bill_total': bill.get_bill_revenue,
                'bill_mrp_total': bill.get_bill_mrp,
                'bill_id': bill.id
            }
            return Response(content)
        elif bill_id:
            try:
                order = Order.objects.get(pk=bill_id, complete=True)
                items = order.orderitem_set.all()
                item_serializer = bill_items_serializer(items, many=True)
                content = {
                    'items': item_serializer.data,
                    'cart_items_quantity': order.get_cart_items_quantity,
                    'cart_total': order.get_cart_revenue,
                    'cart_mrp_total': order.get_cart_mrp,
                    'order_id': order.id
                }
                return Response(content)
            except ObjectDoesNotExist:
                return Response({'error': "no such completed order"})
        else:
            content = {
                'items': [],
                'cart_items_quantity': '',
                'cart_total': '',
                'cart_mrp_total': '',
                'order_id': ''
            }
            return Response(content)
    #
    # @staticmethod
    # def post(request):
    #     action = request.data['action']
    #     customer = request.user
    #     order, created = Order.objects.get_or_create(customer=customer, complete=False)
    #
    #     response = {"response_type": action,
    #                 "response_text": f"{str(action).title()} product was successful."}
    #
    #     try:
    #         product_code = request.data['product_code']
    #     except KeyError:
    #         product_code = None
    #
    #     if product_code:
    #         product = Product.objects.get(product_code=product_code)
    #         order_item, created = OrderItem.objects.get_or_create(order=order, product=product)
    #         if action == 'add':
    #             order_item.quantity = (order_item.quantity + 1)
    #         elif action == 'remove':
    #             order_item.quantity = (order_item.quantity - 1)
    #             if order_item.quantity <= 0:
    #                 order_item.delete()
    #                 return Response(response)
    #         elif action == 'delete':
    #             order_item.delete()
    #             return Response(response)
    #         order_item.save()
    #         return Response(response)
    #     else:
    #         if action == 'add_quantity_by_input':
    #             orderitem_id = request.data['orderitem_id']
    #             orderitem_quantity = request.data['quantity_by_id']
    #             order_item = OrderItem.objects.get(id=orderitem_id)
    #             if orderitem_quantity:
    #                 if int(orderitem_quantity) > 0:
    #                     order_item.quantity = int(orderitem_quantity)
    #                     order_item.save()
    #                 else:
    #                     order_item.delete()
    #             else:
    #                 order_item.delete()
    #             return Response(response)
    #         if action == 'edit_mrp':
    #             orderitem_id = request.data['orderitem_id']
    #             orderitem_mrp = request.data['value']
    #             print(orderitem_id, orderitem_mrp)
    #             order_item = OrderItem.objects.get(id=orderitem_id)
    #             if orderitem_mrp:
    #                 print('works')
    #                 order_item.mrp = float(orderitem_mrp)
    #                 order_item.save()
    #             return Response(response)
    #         if action == 'edit_discount_price':
    #             orderitem_id = request.data['orderitem_id']
    #             orderitem_dp = request.data['value']
    #             order_item = OrderItem.objects.get(id=orderitem_id)
    #             if orderitem_dp:
    #                 order_item.discount_price = float(orderitem_dp)
    #                 order_item.save()
    #             return Response(response)
    #         if action == 'add_quantity':
    #             orderitem_id = request.data['orderitem_id']
    #             order_item = OrderItem.objects.get(id=orderitem_id)
    #             order_item.quantity = (order_item.quantity + 1)
    #             order_item.save()
    #             return Response(response)
    #         if action == 'remove_quantity':
    #             orderitem_id = request.data['orderitem_id']
    #             order_item = OrderItem.objects.get(id=orderitem_id)
    #             order_item.quantity = (order_item.quantity - 1)
    #             if order_item.quantity <= 0:
    #                 order_item.delete()
    #                 return Response(response)
    #             order_item.save()
    #             return Response(response)
    #         if action == 'delete_byId':
    #             orderitem_id = request.data['orderitem_id']
    #             order_item = OrderItem.objects.get(id=orderitem_id)
    #             order_item.delete()
    #             return Response(response)
    #         if action == 'quick_add':
    #             name = request.data['name']
    #             discount_price = request.data['discount_price']
    #             quantity = request.data['quantity']
    #             a = OrderItem.objects.create(order=order, product=None, quantity=int(quantity), product_name=name,
    #                                          discount_price=float(discount_price))
    #             a.save()
    #             return Response(response)
    #
    # @staticmethod
    # def put(request):
    #     # print(request.data)
    #     action = request.data['action']
    #     customer = request.user
    #     order, created = Order.objects.get_or_create(customer=customer, complete=False)
    #
    #     if action == 'complete' and len(order.orderitem_set.all()) <= 0:
    #         return Response(
    #             {"response_type": "completed",
    #              "response_text": "No items to complete order. Please add items"}
    #         )
    #     elif action == 'complete' and len(order.orderitem_set.all()) > 0:
    #         order.complete = True
    #         order.payment_mode = request.data['payment-mode']
    #         order.date_order = now()
    #         order.save()
    #         return Response(
    #             {"response_type": "completed",
    #              "response_text": "Order Completed, Please print the Receipt or click Finish to refresh page"}
    #         )
    #     elif action == 'clear':
    #         OrderItem.objects.filter(order=request.data['product_code']).delete()
    #         return Response(
    #             {"response_type": "updated",
    #              "response_text": "All Cart items removed. Start adding products"}
    #         )
    #     elif action == 'apply_discount':
    #         value = request.data['value']
    #         is_percentage = request.data['is_percentage']
    #
    #         discount, created = Discount.objects.get_or_create(value=int(value), is_percentage=is_percentage)
    #         order.discount = discount
    #         order.save()
    #         return Response(
    #             {"response_type": "Applied",
    #              "response_text": "Discount Applied"}
    #         )
    #     elif action == 'remove_order_discount':
    #         order.discount = None
    #         order.save()
    #         return Response(
    #             {"response_type": "Applied",
    #              "response_text": "Discount Applied"}
    #         )
