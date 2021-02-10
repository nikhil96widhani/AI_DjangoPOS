from django.db.models import F
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.helper import get_variation_data, get_order_item_data
from api.serializers import OrderItemNewSerializer, CartOrderSerializer
from inventory.models_new import OrderNew, ProductVariation, OrderItemNew


class CartListView(generics.ListAPIView):
    queryset = OrderNew.objects.none()
    serializer_class = OrderItemNewSerializer
    # permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        order, created = OrderNew.objects.get_or_create(customer=request.user, complete=False)
        order_items = order.orderitem_set.all()
        queryset = self.filter_queryset(order_items)
        serializer = self.get_serializer(reversed(queryset), many=True)
        return Response({'order_items': serializer.data, 'order': CartOrderSerializer(order).data})


@api_view(['POST'])
def add_order_item(request):
    if request.method == 'POST':
        if 'order_id' not in request.data.keys() and request.user.is_authenticated:
            customer = request.user
            order = OrderNew.objects.get(user=customer, complete=False)
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
            return Response({'status': 'Quantity Updated', 'response': 'Product quantity updated!'})
        except OrderItemNew.MultipleObjectsReturned:
            order_items = order.stockbillitems_set.filter(product_variation=variation.id)
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
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)