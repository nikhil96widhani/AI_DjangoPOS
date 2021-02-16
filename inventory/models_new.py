from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from accounts.models import User , PosCustomer
from django.utils.timezone import now
from datetime import date

from coupons_discounts.models import Discount
from .models import ProductCompany
from inventory.helpers import calculateDiscountPrice

Quantity_unit = (
    ("PCS", "PCS"),
    ("PACK", "PACK")
)

Weight_unit = (
    ("", ""),
    ("mg", "mg"),
    ("g", "g"),
    ("kg", "kg"),
    ("ml", "ml"),
    ("L", "L")
)

Payment_mode = (
    ("Cash", "Cash"),
    ("Card", "Card"),
    ("Paytm", "Paytm"),
    ("UPI", "UPI"),
    ("Other", "Other")
)


class ProductCompanyNew(models.Model):
    name = models.CharField(max_length=200, primary_key=True)

    class Meta:
        verbose_name_plural = "ProductCompany"

    def __str__(self):
        return self.name


class ProductNew(models.Model):
    """

    """
    product_code = models.CharField(primary_key=True, max_length=30)
    name = models.CharField(max_length=100)
    company = models.CharField(max_length=100, blank=True, null=True)
    brand = models.ForeignKey(ProductCompanyNew, on_delete=models.SET_NULL, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    category = models.ManyToManyField('ProductCategories', blank=True)
    rack_number = models.CharField(max_length=100, blank=True, null=True)
    modified_time = models.DateTimeField(default=now, blank=True, null=True, editable=False)

    class Meta:
        verbose_name_plural = "ProductsNew"

    def save(self, *args, **kwargs):
        # Updates Modified time of the product
        self.modified_time = now()
        super(ProductNew, self).save(*args, **kwargs)

    def __str__(self):
        return self.name


class ProductVariation(models.Model):
    product = models.ForeignKey(ProductNew, on_delete=models.CASCADE)
    cost = models.FloatField(blank=True, null=True)
    mrp = models.FloatField(blank=True, null=True)
    discount_price = models.FloatField(blank=True, null=True)
    discount_percentage = models.FloatField(blank=True, null=True)
    quantity_unit = models.CharField(max_length=9, choices=Quantity_unit, default="PCS", blank=True, null=True)
    quantity = models.IntegerField(blank=True, null=True)
    weight = models.IntegerField(blank=True, null=True)
    weight_unit = models.CharField(max_length=9, choices=Weight_unit, default="", blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
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

        super(ProductVariation, self).save(*args, **kwargs)

    def __str__(self):
        return f'{self.id}-{self.product}-{self.cost}-{self.mrp}-{self.discount_price}'


class Vendor(models.Model):
    name = models.CharField(max_length=100, primary_key=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    company = models.ManyToManyField(ProductCompany, blank=True)

    def __str__(self):
        return self.name


class StockBill(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, blank=True, null=True)
    date_ordered = models.DateField(default=now, blank=True, null=True)
    complete = models.BooleanField(default=False, null=True, blank=False)

    bill_cost = models.FloatField(null=True, blank=True)
    bill_mrp = models.FloatField(null=True, blank=True)
    bill_revenue = models.FloatField(null=True, blank=True)
    bill_profit = models.FloatField(null=True, blank=True)
    bill_quantity = models.IntegerField(default=0, null=True, blank=True)

    @property
    def get_bill_revenue(self):
        bill_items = self.stockbillitems_set.all()
        revenue_total = sum([item.get_revenue for item in bill_items])
        return revenue_total

    @property
    def get_bill_cost(self):
        bill_items = self.stockbillitems_set.all()
        cost_total = sum([item.get_cost for item in bill_items])
        return cost_total

    @property
    def get_bill_mrp(self):
        bill_items = self.stockbillitems_set.all()
        mrp_total = sum([item.get_mrp for item in bill_items])
        return mrp_total

    @property
    def get_bill_items_quantity(self):
        bill_items = self.stockbillitems_set.all()
        total = sum([item.stock for item in bill_items])
        return total

    @property
    def get_bill_profit(self):
        profit_total = self.get_bill_revenue - self.get_bill_cost
        return profit_total

    def save(self, *args, **kwargs):
        self.bill_revenue = "{:.2f}".format(self.get_bill_revenue)
        self.bill_profit = "{:.2f}".format(self.get_bill_profit)
        self.bill_cost = "{:.2f}".format(self.get_bill_cost)
        self.bill_mrp = self.get_bill_mrp
        self.bill_quantity = self.get_bill_items_quantity

        if not self.date_ordered:
            self.expiry_date = now
        super(StockBill, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.id)


class StockBillItems(models.Model):
    stock_bill = models.ForeignKey(StockBill, on_delete=models.SET_NULL, blank=True, null=True)
    product_variation = models.ForeignKey(ProductVariation, on_delete=models.SET_NULL, blank=True, null=True)
    product_code = models.CharField(max_length=30, blank=True, null=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    cost = models.FloatField(blank=True, null=True)
    mrp = models.FloatField(blank=True, null=True)
    discount_price = models.FloatField(blank=True, null=True)
    discount_percentage = models.FloatField(blank=True, null=True)
    stock = models.IntegerField(blank=True, null=True, default=0)
    quantity_unit = models.CharField(max_length=9, choices=Quantity_unit, default="PCS", blank=True, null=True)
    weight = models.IntegerField(blank=True, null=True)
    weight_unit = models.CharField(max_length=9, choices=Weight_unit, default="", blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    is_new_variation = models.BooleanField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "StockBillItems"

    def save(self, *args, **kwargs):
        # Updates Other Details of the product
        self.product_code = self.product_variation.product.product_code
        self.name = self.product_variation.product.name
        self.discount_price = self.discount_price if self.discount_price else self.product_variation.discount_price
        self.mrp = self.mrp if self.mrp else self.product_variation.mrp
        self.cost = self.cost if self.cost else self.product_variation.cost
        self.weight = self.weight if self.weight else self.product_variation.weight
        self.weight_unit = self.product_variation.weight_unit

        if not self.expiry_date:
            today = date.today()
            self.expiry_date = date(today.year, today.month + 3, today.day)

        super(StockBillItems, self).save(*args, **kwargs)

    @property
    def get_revenue(self):
        total = self.stock * self.discount_price
        return total

    @property
    def get_cost(self):
        total = self.stock * self.cost
        return total

    @property
    def get_mrp(self):
        total = self.stock * self.mrp
        return total

    def __str__(self):
        return self.name


class OrderNew(models.Model):
    customer = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    pos_customer = models.ForeignKey(PosCustomer, on_delete=models.SET_NULL, blank=True, null=True)
    date_order = models.DateTimeField(default=now, editable=False)
    payment_mode = models.CharField(max_length=10, choices=Payment_mode, default="Cash", blank=True, null=True)
    cart_revenue = models.FloatField(null=True, blank=True)
    cart_profit = models.FloatField(null=True, blank=True)
    cart_cost = models.FloatField(null=True, blank=True)
    cart_mrp = models.FloatField(null=True, blank=True)
    cart_quantity = models.IntegerField(default=0, null=True, blank=True)
    complete = models.BooleanField(default=False, null=True, blank=False)
    discount = models.ForeignKey(Discount, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name_plural = "Orders - New"

    @property
    def get_cart_revenue(self):
        order_items = self.orderitemnew_set.all()
        revenue_total = sum([item.get_revenue for item in order_items])
        if self.discount:
            if self.discount.is_percentage:
                revenue_total = calculateDiscountPrice(revenue_total, int(self.discount.value))
            else:
                revenue_total = revenue_total - int(self.discount.value)
        return round(revenue_total, 2)

    @property
    def get_cart_revenue_NoDiscount(self):
        order_items = self.orderitemnew_set.all()
        revenue_total = sum([item.get_revenue for item in order_items])
        return round(revenue_total, 2)

    @property
    def get_cart_cost(self):
        order_items = self.orderitemnew_set.all()
        cost_total = sum([item.get_cost for item in order_items])
        return cost_total

    @property
    def get_cart_mrp(self):
        order_items = self.orderitemnew_set.all()
        mrp_total = sum([item.get_mrp for item in order_items])
        return mrp_total

    @property
    def get_cart_items_quantity(self):
        order_items = self.orderitemnew_set.all()
        total = sum([item.quantity for item in order_items])
        return total

    @property
    def get_cart_profit(self):
        profit_total = self.get_cart_revenue - self.get_cart_cost
        return profit_total

    def save(self, *args, **kwargs):
        self.cart_revenue = "{:.2f}".format(self.get_cart_revenue)
        self.cart_profit = "{:.2f}".format(self.get_cart_profit)
        self.cart_cost = "{:.2f}".format(self.get_cart_cost)
        self.cart_mrp = self.get_cart_mrp
        self.cart_quantity = self.get_cart_items_quantity
        super(OrderNew, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.id)


class OrderItemNew(models.Model):
    # References
    order = models.ForeignKey(OrderNew, on_delete=models.CASCADE, blank=True, null=True)
    product = models.ForeignKey(ProductNew, on_delete=models.SET_NULL, blank=True, null=True)
    variation = models.ForeignKey(ProductVariation, on_delete=models.SET_NULL, blank=True, null=True)
    discount = models.ForeignKey(Discount, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Copied Values
    ##########################################################################
    # Product Values
    product_code = models.CharField(max_length=30, blank=True, null=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    
    # Variation Values
    weight = models.IntegerField(blank=True, null=True)
    weight_unit = models.CharField(max_length=9, blank=True, null=True)
    cost = models.FloatField(null=True, blank=True)
    mrp = models.FloatField(null=True, blank=True)
    discount_price = models.FloatField(null=True, blank=True)
    ##########################################################################
    
    # Extra
    amount = models.FloatField(null=True, blank=True)
    quantity = models.IntegerField(default=0, null=True, blank=True)
    date_added = models.DateField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Order Items - New"

    def save(self, *args, **kwargs):
        if self.quantity <= 0:
            self.delete()  # you do not need neither to return the deleted object nor to call the super method.
        else:
            if self.product is not None:
                self.product_code = self.product.product_code
                self.name = self.product.name
                self.discount_price = self.discount_price if self.discount_price else self.variation.discount_price
                self.mrp = self.mrp if self.mrp else self.variation.mrp
                self.cost = self.variation.cost
                self.weight = self.variation.weight
                self.weight_unit = self.variation.weight_unit

            else:
                self.product_code = None
                self.mrp = self.discount_price
                self.cost = self.discount_price

            if self.discount_price and self.quantity:
                self.amount = round(self.quantity * self.discount_price, 2)
                super(OrderItemNew, self).save(*args, **kwargs)
            elif self.mrp and self.quantity:
                self.amount = round(self.quantity * self.mrp, 2)
                super(OrderItemNew, self).save(*args, **kwargs)
            else:
                self.amount = None
                super(OrderItemNew, self).save(*args, **kwargs)

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
        return str(f'Order Id - {self.order} | Order Item Id - {self.id}')
