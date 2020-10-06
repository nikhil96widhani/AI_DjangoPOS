from django.db import models

# Create your models here.


class Product(models.Model):
    name = models.CharField(max_length=100)
    cost = models.FloatField()
    mrp = models.FloatField()
    discount_price = models.FloatField(blank=True, null=True)
    quantity = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    product_code = models.CharField(max_length=20)
    category = models.ManyToManyField('ProductCategories', blank=True, null=True)

    def __str__(self):
        return self.name


class ProductCategories(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "ProductCategories"

    def __str__(self):
        return self.name
