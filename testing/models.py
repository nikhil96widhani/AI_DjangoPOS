from django.db import models
from accounts.models import User
from inventory.models import ProductCategories


# Create your models here.


class testProduct(models.Model):
    product_code = models.CharField(primary_key=True, max_length=20)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    category = models.ManyToManyField(ProductCategories, blank=True)
    # main_variation = models.ForeignKey('testProductVariations', on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return self.name


class testProductVariations(models.Model):
    product = models.ForeignKey(testProduct, on_delete=models.SET_NULL, blank=True, null=True)
    # variation_name = models.CharField(blank=True, null=True max_length=100)
    quantity = models.IntegerField(default=0, null=True, blank=True)
    date_added = models.DateField(auto_now_add=True)
    cost = models.FloatField()
    mrp = models.FloatField()
    discount_price = models.FloatField(blank=True, null=True)
    weight = models.CharField(max_length=100, blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.discount_price is None:
            self.discount_price = self.mrp
            super(testProductVariations, self).save(*args, **kwargs)
        else:
            self.discount_price = self.discount_price
            super(testProductVariations, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.id)

