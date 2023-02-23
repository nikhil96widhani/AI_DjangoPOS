from django.contrib import admin

import inventory.models
from .models import *


class ProductList(admin.ModelAdmin):
    list_display = ('name', 'product_code', 'quantity')
    # exclude = ('amount',)


class OrderItemList(admin.ModelAdmin):
    list_display = ('product_name', 'order', 'quantity', 'amount')
    exclude = ('amount',)


# Register your models here.
# admin.site.register(Product, ProductList)
# admin.site.register(OrderItem, OrderItemList)
# admin.site.register(Order)
admin.site.register(ProductCategories)
admin.site.register(ProductCompany)
admin.site.register(inventory.models.Product)
admin.site.register(inventory.models.ProductVariation)
admin.site.register(inventory.models.Vendor)
admin.site.register(inventory.models.StockBill)
admin.site.register(inventory.models.StockBillItems)
admin.site.register(inventory.models.Order)
admin.site.register(inventory.models.OrderItem)
admin.site.register(inventory.models.WishList)
