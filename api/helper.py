from inventory.models_new import *
from .serializers import *


def BillData(bill_object, self):
    bill_items = bill_object.stockbillitems_set.all()
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
