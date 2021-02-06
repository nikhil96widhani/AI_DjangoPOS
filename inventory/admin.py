from django.contrib import admin

from . import models_new
from .models import *


class ProductList(admin.ModelAdmin):
    list_display = ('name', 'product_code', 'quantity')
    # exclude = ('amount',)


class OrderItemList(admin.ModelAdmin):
    list_display = ('product_name', 'order', 'quantity', 'amount')
    exclude = ('amount',)


# Register your models here.
admin.site.register(Product, ProductList)
admin.site.register(ProductCategories)
admin.site.register(ProductCompany)
admin.site.register(Order)
admin.site.register(OrderItem, OrderItemList)
admin.site.register(models_new.ProductNew)
admin.site.register(models_new.ProductVariation)
admin.site.register(models_new.Vendor)
admin.site.register(models_new.StockBill)
admin.site.register(models_new.StockBillItems)
admin.site.register(models_new.OrderNew)
admin.site.register(models_new.OrderItemNew)
