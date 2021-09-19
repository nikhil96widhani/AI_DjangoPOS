# %%
import sqlite3
import pandas as pd
from inventory.models import *
from dateutil import parser

# Create your connection.
cnx = sqlite3.connect('Helper Functions/db.sqlite3')

# %% Add products
df = pd.read_sql_query("SELECT * FROM inventory_product", cnx)
df = df.where(pd.notnull(df), None)

for index, row in df.iterrows():
    # Create product Object
    a = Product.objects.create(
        product_code=row['product_code'],
        name=row['name']
    )
    a.description = row['description']
    if row['company'] is not None:
        company, created = ProductCompany.objects.get_or_create(name=row['company'])
        a.brand = company
    a.description = row['description']
    a.modified_time = parser.parse(row['modified_time'])
    a.save()

    # create product variation
    b = ProductVariation.objects.create(product=a)
    b.cost = row['cost']
    b.mrp = row['mrp']
    b.discount_price = row['discount_price']
    b.discount_percentage = row['discount_percentage']
    b.quantity_unit = row['quantity_unit']
    b.quantity = row['quantity']
    b.weight = row['weight']
    b.weight_unit = row['weight_unit']
    b.expiry_date = row['expiry_date']
    b.save()

# %% Add Discount
df = pd.read_sql_query("SELECT * FROM coupons_discounts_discount", cnx)
df = df.where(pd.notnull(df), None)
for index, row in df.iterrows():
    a = Discount.objects.create(
        id=row['id'],
        value=row['value'],
        is_percentage=row['is_percentage']
    )
    a.save()

# %% Add orders
from inventory.models import Order

""" DISABLE SAVE function in the models AND THEN CLOSE CONSOLE, IMPORT FIRST BLOCK AND RERUN CODE"""
df = pd.read_sql_query("SELECT * FROM inventory_order", cnx)
df = df.where(pd.notnull(df), None)

# Create user id 1,2 i Django admin first
for index, row in df.iterrows():
    user = User.objects.get(id=row['customer_id'])
    a = Order.objects.create(id=row['id'], customer=user)
    a.save()
    a.date_order = row['date_order']
    a.payment_mode = row['payment_mode']
    a.cart_revenue = row['cart_revenue']
    a.cart_profit = row['cart_profit']
    a.cart_cost = row['cart_cost']
    a.cart_mrp = row['cart_mrp']
    a.cart_quantity = row['cart_quantity']
    a.complete = row['complete']
    if row['discount_id']:
        disc = Discount.objects.get(id=row['discount_id'])
        a.discount = disc
    a.save()

# %% Add orders_Items
df = pd.read_sql_query("SELECT * FROM inventory_orderitem", cnx)
df = df.where(pd.notnull(df), None)

for index, row in df.iterrows():
    order = Order.objects.get(id=row['order_id'])
    try:
        product = Product.objects.get(product_code=row['product_id'])
        product_variation = ProductVariation.objects.get(product=product)
    except:
        product = None
        product_variation = None

    orderitem = OrderItem.objects.create(
        id=row['id'],
        order=order,
        product=product,
        variation=product_variation
    )
    orderitem.product_code = row['product_id']
    orderitem.name = row['product_name']
    orderitem.weight = row['weight']
    orderitem.weight_unit = row['weight_unit']
    orderitem.cost = row['cost']
    orderitem.mrp = row['mrp']
    orderitem.discount_price = row['discount_price']
    orderitem.amount = row['amount']
    orderitem.quantity = row['quantity']
    orderitem.date_added = row['date_added']

    orderitem.save()
