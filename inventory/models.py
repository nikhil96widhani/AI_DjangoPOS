from django.db import models
from accounts.models import User
from .helpers import *
from django.utils.timezone import now

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

Payment_mode = (
    ("Cash", "Cash"),
    ("Card", "Card"),
    ("Paytm", "Paytm"),
    ("UPI", "UPI"),
    ("Other", "Other")
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
    modified_time = models.DateTimeField(default=now, blank=True, null=True, editable=False)

    def save(self, *args, **kwargs):
        # Sets discount price of product
        if self.discount_price is None:
            self.discount_price = self.mrp

        # # Discount percentage
        if self.discount_percentage is None:
            try:
                discount = (1 - self.discount_price / self.mrp) * 100
                discount = "{:.2f}".format(discount)
            except:
                discount = None
            self.discount_percentage = discount

        # Updates Modified time of the product
        self.modified_time = now()

        super(Product, self).save(*args, **kwargs)

    # @property
    # def somefunction(self):
    #     return ''

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
    date_order = models.DateTimeField(default=now, editable=False)
    payment_mode = models.CharField(max_length=10, choices=Payment_mode, default="Cash", blank=True, null=True)
    cart_revenue = models.FloatField(null=True, blank=True)
    cart_profit = models.FloatField(null=True, blank=True)
    cart_cost = models.FloatField(null=True, blank=True)
    cart_mrp = models.FloatField(null=True, blank=True)
    cart_quantity = models.IntegerField(default=0, null=True, blank=True)
    complete = models.BooleanField(default=False, null=True, blank=False)

    @property
    def get_cart_revenue(self):
        order_items = self.orderitem_set.all()
        revenue_total = sum([item.get_revenue for item in order_items])
        return revenue_total

    @property
    def get_cart_cost(self):
        order_items = self.orderitem_set.all()
        cost_total = sum([item.get_cost for item in order_items])
        return cost_total

    @property
    def get_cart_mrp(self):
        order_items = self.orderitem_set.all()
        mrp_total = sum([item.get_mrp for item in order_items])
        return mrp_total

    @property
    def get_cart_items_quantity(self):
        order_items = self.orderitem_set.all()
        total = sum([item.quantity for item in order_items])
        return total

    @property
    def get_cart_profit(self):
        profit_total = self.get_cart_revenue - self.get_cart_cost
        return profit_total

    def save(self, *args, **kwargs):
        self.cart_revenue = self.get_cart_revenue
        self.cart_profit = self.get_cart_profit
        self.cart_cost = self.get_cart_cost
        self.cart_mrp = self.get_cart_mrp
        self.cart_quantity = self.get_cart_items_quantity
        super(Order, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.id)


class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, blank=True, null=True)
    product_code = models.CharField(max_length=30, blank=True, null=True)
    product_name = models.CharField(max_length=100, blank=True, null=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, blank=True, null=True)
    quantity = models.IntegerField(default=0, null=True, blank=True)
    date_added = models.DateField(auto_now_add=True)
    cost = models.FloatField(null=True, blank=True)
    mrp = models.FloatField(null=True, blank=True)
    discount_price = models.FloatField(null=True, blank=True)
    amount = models.FloatField(null=True, blank=True)

    def save(self, *args, **kwargs):
        self.product_code = self.product.product_code
        self.product_name = self.product.name
        self.discount_price = self.product.discount_price
        self.mrp = self.product.mrp
        self.cost = self.product.cost

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
    def get_revenue(self):
        total = self.quantity * self.discount_price
        return total

    @property
    def get_cost(self):
        total = self.quantity * self.cost
        return total

    @property
    def get_mrp(self):
        total = self.quantity * self.mrp
        return total

    def __str__(self):
        return str(self.id)

