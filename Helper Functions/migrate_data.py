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


# %% Add orders
df = pd.read_sql_query("SELECT * FROM inventory_product", cnx)
df = df.where(pd.notnull(df), None)