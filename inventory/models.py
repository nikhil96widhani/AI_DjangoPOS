from django.db import models
from accounts.models import User
from .helpers import *


# Create your models here.

Quantity_unit = (
    ("PCS", "PCS"),
    ("PACK", "PACK")
)

Weight_unit = (
    ("", ""),
    ("mg", "mg"),
    ("g", "g"),
    ("kg", "kg")
)


class Product(models.Model):
    """
    New Fields Added :
        Weight Unit: Self Explain
        Quantity Unit: Self Explain
        Company: Name of the company
        Rack Number: Place where item is located
        Expiry Date: Self Explain
    """

    """
        IN CASE YOU EVER FUCK UP MIGRATIONS AND YOU HAVE TO ADD SOME FIELDS BUT YOU DELETED OLD MIGRATIONS HISTORY->
        
        FIRST COMMENT NEW FIELDS AN RUN MIGRATIONS WITH DB CURRENT STATE -> RUN
        $ python manage.py makemigrations
        $ python manage.py migrate appname --fake-initial
        
        IF RAN SMOOTHLY THEN UNCOMMENT NEW FIELDS AND RUN BELOW LINES.
        $ python manage.py makemigrations
        $ python manage.py migrate
        
    """
    product_code = models.CharField(primary_key=True, max_length=30)

    name = models.CharField(max_length=100)
    cost = models.FloatField()
    mrp = models.FloatField()
    discount_price = models.FloatField(blank=True, null=True)
    discount_percentage = models.FloatField(blank=True, null=True)
    quantity_unit = models.CharField(max_length=9, choices=Quantity_unit, default="PCS", blank=True, null=True)
    quantity = models.IntegerField(blank=True, null=True)
    weight = models.IntegerField(blank=True, null=True)
    weight_unit = models.CharField(max_length=9, choices=Weight_unit, default="", blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    company = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    category = models.ManyToManyField('ProductCategories', blank=True)
    rack_number = models.CharField(max_length=100, blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.discount_price is None:
            self.discount_price = self.mrp
            super(Product, self).save(*args, **kwargs)
        else:
            self.discount_price = self.discount_price
            super(Product, self).save(*args, **kwargs)

    @property
    def get_discount_percentage(self):
        discount = (1 - self.discount_price / self.mrp) * 100
        return discount

    def __str__(self):
        return self.name


class ProductCategories(models.Model):
    name = models.CharField(max_length=100, primary_key=True)

    class Meta:
        verbose_name_plural = "ProductCategories"

    def __str__(self):
        return self.name


class Order(models.Model):
    customer = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    date_order = models.DateField(auto_now_add=True)
    complete = models.BooleanField(default=False, null=True, blank=False)

    @property
    def get_cart_total(self):
        orderitems = self.orderitem_set.all()
        total = sum([item.get_total for item in orderitems])
        return total

    @property
    def get_cart_cost_total(self):
        orderitems = self.orderitem_set.all()
        total = sum([item.get_cost_total for item in orderitems])
        return total

    @property
    def get_cart_mrp_total(self):
        orderitems = self.orderitem_set.all()
        total = sum([item.get_mrp_total for item in orderitems])
        return total

    @property
    def get_cart_items_quantity(self):
        orderitems = self.orderitem_set.all()
        total = sum([item.quantity for item in orderitems])
        return total

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

    @property
    def get_total(self):
        total = self.quantity * self.product.discount_price
        return total

    @property
    def get_cost_total(self):
        total = self.quantity * self.product.cost
        return total

    @property
    def get_mrp_total(self):
        total = self.quantity * self.product.mrp
        return total

    def __str__(self):
        return str(self.id)
