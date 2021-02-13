from django.db.models import F
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.helper import get_variation_data, get_order_item_data, add_order_item, update_order_item, clear_cart
from api.serializers import OrderItemNewSerializer, CartOrderSerializer, CartOrderNewSerializer
from inventory.models_new import OrderNew, ProductVariation, OrderItemNew


class CartListViewNew(generics.ListAPIView):
    queryset = OrderNew.objects.none()
    serializer_class = OrderItemNewSerializer
    # permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        order, created = OrderNew.objects.get_or_create(customer=request.user, complete=False)
        order_items = order.orderitemnew_set.all()
        queryset = self.filter_queryset(order_items)
        serializer = self.get_serializer(reversed(queryset), many=True)
        return Response({'order_items': serializer.data, 'order': CartOrderNewSerializer(order).data})


@api_view(['POST'])
def handle_order(request):
    if request.method == 'POST':
        action = request.data['action']
        if action == 'add-order-item':
            return add_order_item(request)

        elif action == 'update-order-item':
            return update_order_item(request)

        elif action == 'clear-cart':
            return clear_cart(request)

        else:
            return Response({'status': 'unknown_request'})