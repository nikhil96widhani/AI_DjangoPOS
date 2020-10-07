from django.db import models
from accounts.models import User

# Create your models here.


class Product(models.Model):
    name = models.CharField(max_length=100)
    cost = models.FloatField()
    mrp = models.FloatField()
    discount_price = models.FloatField(blank=True, null=True)
    quantity = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    product_code = models.CharField(max_length=20)
    category = models.ManyToManyField('ProductCategories', blank=True)

    def __str__(self):
        return self.name


class ProductCategories(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "ProductCategories"

    def __str__(self):
        return self.name


class Order(models.Model):
    customer = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    date_order = models.DateField(auto_now_add=True)
    complete = models.BooleanField(default=False, null=True, blank=False)

    def __str__(self):
        return str(self.id)


class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, blank=True, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, blank=True, null=True)
    quantity = models.IntegerField(default=0, null=True, blank=True)
    date_added = models.DateField(auto_now_add=True)
    amount = models.FloatField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.product.discount_price and self.quantity:
            self.amount = self.quantity * self.product.discount_price
            super(OrderItem, self).save(*args, **kwargs)
        elif self.product.mrp and self.quantity:
            self.amount = self.quantity * self.product.mrp
            super(OrderItem, self).save(*args, **kwargs)
        else:
            self.amount = None
            super(OrderItem, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.id)

