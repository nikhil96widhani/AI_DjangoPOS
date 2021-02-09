from inventory.models_new import *
from .serializers import *


def BillData(bill_object, self):
    bill_items = reversed(bill_object.stockbillitems_set.all())
    queryset = self.filter_queryset(bill_items)
    bill_item_serializer = self.get_serializer(queryset, many=True)

    content = {
        'bill_name': bill_object.name,
        'bill_vendor': bill_object.vendor,
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
