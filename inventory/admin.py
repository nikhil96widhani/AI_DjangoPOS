from django.contrib import admin
from .models import *


class OrderItemList(admin.ModelAdmin):
    list_display = ('product', 'order', 'quantity', 'amount')
    exclude = ('amount',)


# Register your models here.
admin.site.register(Product)
admin.site.register(ProductCategories)
admin.site.register(Order)
admin.site.register(OrderItem, OrderItemList)
