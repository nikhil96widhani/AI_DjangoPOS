from datetime import datetime, timedelta

from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import api_view
from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from rest_framework import generics, mixins
from .helper import *


def get_default_vendor(bill):
    if bill.vendor is None:
        vendor, created = Vendor.objects.get_or_create(name='unknown')
        return vendor
    else:
        return bill.vendor


class StockBillApiView(mixins.ListModelMixin, GenericAPIView):
    queryset = StockBillItems.objects.none()
    serializer_class = StockBillItemSerializer

    def get(self, request, format=None):
        bill_id = request.GET.get("bill_id")
        if bill_id is None and request.user.is_authenticated:
            customer = request.user
            bill = StockBill.objects.get(user=customer, complete=False)
            context = BillData(bill, self)
            return Response(context)
        elif bill_id:
            try:
                bill = StockBill.objects.get(pk=bill_id)
                context = BillData(bill, self)
                return Response(context)
            except ObjectDoesNotExist:
                return Response({'error': "no such bill found"})

        else:
            content = {'please move along': 'nothing to see here'}
            Response(content, status=status.HTTP_404_NOT_FOUND)

    @staticmethod
    def delete(request):
        print('delete')
        bill_id = request.data["bill_id"]
        print('id ' + bill_id)
        bill = StockBill.objects.get(pk=bill_id)
        bill.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @staticmethod
    def post(request):
        action = request.data['action']
        message = 'Error Updating Data'
        customer = request.user
        if action == 'update_bill':
            bill = StockBill.objects.get(user=customer, complete=False)
            if request.data.get('update_vendor') is True:
                vendor_obj, created = Vendor.objects.get_or_create(name=request.data['vendor_name'])
                bill.vendor = vendor_obj
                bill.save()
                message = 'Bill vendor successfully updated'
            else:
                serializer = StockBillSerializer(bill, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    message = 'Bill data successfully updated'
        elif action == 'update_bill_item':
            bill_item = StockBillItems.objects.get(id=request.data['id'])

            if 'is_new_variation' in request.data and request.data['is_new_variation'] == '0':
                variations_of_same_id = StockBillItems.objects.filter(
                    product_variation=bill_item.product_variation).values_list(
                    'is_new_variation', flat=True)
                if sum(variations_of_same_id) + 1 == len(variations_of_same_id):
                    message = 'Cannot unset as old variation is already being edited'
                else:
                    serializer = StockBillItemSerializer(bill_item, data=request.data, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                        message = 'Bill item was successfully updated'
            else:
                serializer = StockBillItemSerializer(bill_item, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    message = 'Bill item was successfully updated'

        elif action == 'delete_billItem':
            billItem_id = request.data['billItem_id']
            billItem = StockBillItems.objects.get(id=billItem_id)
            billItem.delete()
            message = 'Successfully removed item'

        elif action == 'complete_and_update':
            bill_id = request.GET.get("bill_id")
            if bill_id is None and request.user.is_authenticated:
                customer = request.user
                bill = StockBill.objects.get(user=customer, complete=False)
                bill_items = bill.stockbillitems_set.all()
                updateProducts_fromBillItems(bill_items)
                bill.complete = True
                bill.vendor = get_default_vendor(bill)
                bill.save()
                message = 'Bill Saved'
            elif bill_id:
                try:
                    bill = StockBill.objects.get(pk=bill_id)
                    bill_items = bill.stockbillitems_set.all()
                    updateProducts_fromBillItems(bill_items)
                    bill.complete = True
                    bill.vendor = get_default_vendor(bill)
                    bill.save()
                    message = 'Bill Saved'
                except ObjectDoesNotExist:
                    message = 'an error occurred'
        return Response(message)

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


@api_view(['GET'])
def searchProductVariations(request):
    if request.method == 'GET':
        """
            This is an Temporary search fix until we use POSTGRES database for final build. 
            Once we start using postgres we can use full text search function feature with weights.   
        """
        search_term = request.GET.get("search_term")
        if search_term:
            products_contains = ProductVariation.objects.filter(product__name__contains=search_term)[:8]
            products_starts = ProductVariation.objects.filter(product__name__startswith=search_term)[:3]
            products_code_starts = ProductVariation.objects.filter(product__product_code__startswith=search_term)[:5]
            products = (products_starts | products_contains | products_code_starts)[:8]
        else:
            products = ProductVariation.objects.all()[:10]

        product_serializer = ProductVariationSerializer(products, many=True)
        return Response(product_serializer.data)


@api_view(['POST'])
def add_bill_item(request):
    if request.method == 'POST':
        if 'bill_id' not in request.data.keys() and request.user.is_authenticated:
            customer = request.user
            bill = StockBill.objects.get(user=customer, complete=False)
            stock_bill = bill.id

        else:
            stock_bill = request.data['bill_id']
            bill = StockBill.objects.get(pk=stock_bill)

        if 'variation_id' in request.data.keys():
            variation_id = request.data['variation_id']
            variation = ProductVariation.objects.get(pk=variation_id)

        else:
            # Add Variation using Product Code if only one variation is present
            product_code = request.data['product_code']
            try:
                variation = ProductVariation.objects.get(product=product_code)
            except ProductVariation.MultipleObjectsReturned:
                return Response({'multiple_variation_exists': True, **get_variation_data(product_code)})

        try:
            # variations_of_same_id = bill.stockbillitems_set.get(product_variation=variation.id)

            variations_of_same_id = bill.stockbillitems_set.filter(product_variation=variation.id).values_list(
                'is_new_variation', flat=True)
            if sum(variations_of_same_id) == len(variations_of_same_id):
                bill_item_data = {'stock_bill': stock_bill, **get_bill_item_data(variation)}
            else:
                return Response({'status': 'error', 'response': 'Variation already exists in bill items!'})
        except StockBillItems.MultipleObjectsReturned:
            bill_items = bill.stockbillitems_set.filter(product_variation=variation.id)
            for i in range(1, len(bill_items)):
                bill_items[i].delete()
            return Response({'status': 'error',
                             'response': 'Multiple variations were present. Deleted duplicate variations.'})
        except StockBillItems.DoesNotExist:
            bill_item_data = {'stock_bill': stock_bill, **get_bill_item_data(variation)}

            # Save bill item
        serializer = StockBillItemSerializer(data=bill_item_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VendorListView(APIView):
    @staticmethod
    def get(request):
        search_term = request.GET.get("query")
        if search_term:
            vendors = Vendor.objects.filter(name__contains=search_term)[:10].values_list(flat=True)
        else:
            vendors = Vendor.objects.all()[:10].values_list('name', flat=True)
        return Response({'suggestions': vendors})


# Fixed -- Datatable for stock bills
class StockBillsListView(generics.ListAPIView):
    queryset = StockBill.objects.filter(complete=True).order_by('-id')
    serializer_class = StockBillSerializer

    def list(self, request, *args, **kwargs):
        temp_queryset = self.get_queryset()
        if request.GET.get("date1") and request.GET.get("date2"):
            date1 = datetime.strptime(request.GET.get("date1"), '%Y-%m-%d')
            date2 = datetime.strptime(request.GET.get("date2"), '%Y-%m-%d') + timedelta(days=1)
            temp_queryset = StockBill.objects.filter(complete=True).filter(date_ordered__range=[date1, date2]).order_by(
                '-id')

        queryset = self.filter_queryset(temp_queryset)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class StockBillItemsView(APIView):
    @staticmethod
    def get(request):
        stock_bill = StockBill.objects.get(pk=request.GET.get("order_id"))
        stock_bill_items = stock_bill.stockbillitems_set.all()
        stock_bill_item_serializer = StockBillItemSerializer(stock_bill_items, many=True)
        return Response({'stock_bill_items': stock_bill_item_serializer.data})
