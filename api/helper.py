from django.db.models import F
from rest_framework import status
from rest_framework.response import Response

from .serializers import *


def BillData(bill_object, self):
    bill_items = reversed(bill_object.stockbillitems_set.all())
    queryset = self.filter_queryset(bill_items)
    bill_item_serializer = self.get_serializer(queryset, many=True)

    content = {
        'bill_name': bill_object.name,
        'bill_vendor': bill_object.vendor.name if bill_object.vendor else None,
        'bill_date_ordered': bill_object.date_ordered,
        'bill_items_quantity': bill_object.get_bill_items_quantity,
        'bill_total': bill_object.get_bill_cost,
        'bill_mrp_total': bill_object.get_bill_mrp,
        'bill_id': bill_object.id,
        'bill_items': bill_item_serializer.data,
    }
    return content


def get_variation_data(product_code):
    variations = ProductVariation.objects.filter(product=product_code)
    variation_data = [ProductVariationPostSerializer(variation).data for variation in variations]

    product = ProductNew.objects.get(pk=product_code)
    product_data = ProductNewSerializer(product).data

    return {'product_data': product_data, 'variation_data': variation_data}


def get_bill_item_data(variation):
    return {
        "product_variation": variation.id,
        "product_code": variation.product.product_code,
        "name": variation.product.name,
        "cost": variation.cost,
        "mrp": variation.mrp,
        "discount_price": variation.discount_price,
        "discount_percentage": variation.discount_percentage,
        "quantity": variation.quantity,
        "quantity_unit": variation.quantity_unit,
        "weight": variation.weight,
        "weight_unit": variation.weight_unit,
        "expiry_date": variation.expiry_date,
        "is_new_variation": False
    }


def get_order_item_data(variation):
    return {
        "product": variation.product.product_code,
        "variation": variation.id,
        "quantity": 1,
    }


def updateProducts_fromBillItems(bill_items):
    for each in bill_items:
        ProductVariation.objects.filter(id=each.product_variation.id).update(
            cost=each.cost,
            mrp=each.mrp,
            discount_price=each.discount_price,
            quantity=F('quantity') + each.stock,
            weight=each.weight,
            expiry_date=each.expiry_date
        )


def add_order_item(request):
    if 'order_id' not in request.data.keys() and request.user.is_authenticated:
        customer = request.user
        order = OrderNew.objects.get(customer=customer, complete=False)
        order_id = order.id

    else:
        order_id = request.data['order_id']
        order = OrderNew.objects.get(pk=order_id)

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
        order_item = order.orderitemnew_set.get(variation=variation.id)
        order_item.quantity += 1
        order_item.save()
        return Response({'status': 'quantity_updated', 'response': 'Product quantity updated!',
                         'data': OrderItemNewSerializer(order_item).data})
    except OrderItemNew.MultipleObjectsReturned:
        order_items = order.orderitemnew_set.filter(product_variation=variation.id)
        for i in range(1, len(order_items)):
            order_items[i].delete()
        return Response({'status': 'error',
                         'response': 'Multiple variations were present. Deleted duplicate variations.'})
    except OrderItemNew.DoesNotExist:
        order_item_data = {'order': order_id, **get_order_item_data(variation)}

        # Save bill item
        serializer = OrderItemNewSerializer(data=order_item_data)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'order_item_add', 'response': 'Added Order Item.',
                             'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def update_order_item(request):
    order_item = OrderItemNew.objects.get(id=request.data['order_item_id'])
    serializer = OrderItemNewSerializer(order_item, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'status': 'updated', 'response': 'Order item details updated.', 'data': serializer.data})


def clear_cart(request):
    if 'order_id' not in request.data.keys() and request.user.is_authenticated:
        customer = request.user
        order = OrderNew.objects.get(customer=customer, complete=False)

    else:
        order_id = request.data['order_id']
        order = OrderNew.objects.get(pk=order_id)

    order_items = order.orderitemnew_set.all()
    for item in order_items:
        item.delete()
    return Response({'status': 'cart-cleared', 'response': 'Cleared cart successfully.'})
