from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.timezone import now

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
