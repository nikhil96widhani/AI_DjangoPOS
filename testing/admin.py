from django.contrib import admin
from .models import *


class testProductList(admin.ModelAdmin):
    list_display = ('name', 'product_code')
    # exclude = ('amount',)


# Register your models here.
admin.site.register(testProduct, testProductList)
admin.site.register(testProductVariations)
