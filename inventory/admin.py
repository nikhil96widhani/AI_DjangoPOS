from django.contrib import admin
from .models import *


class ProductList(admin.ModelAdmin):
    list_display = ('name', 'product_code', 'quantity')
    # exclude = ('amount',)


class OrderItemList(admin.ModelAdmin):
    list_display = ('product', 'order', 'quantity', 'amount')
    exclude = ('amount',)


# Register your models here.
admin.site.register(Product, ProductList)
admin.site.register(ProductCategories)
admin.site.register(Order)
admin.site.register(OrderItem, OrderItemList)
