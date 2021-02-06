from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.serializers import OrderItemNewSerializer, CartOrderSerializer
from inventory.models_new import OrderNew


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