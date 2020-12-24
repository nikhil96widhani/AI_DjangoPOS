# %%
import pandas as pd

# %%
df = pd.read_csv('Helper Functions/stock_2.csv')


# %%

def cleaning(dff):
    dff = dff.dropna(subset=['Barcode'])
    # dff[dff.stock < 0] = 0
    dff['Barcode'] = dff['Barcode'].astype(str)
    # dff = dff[~(dff.barcode.str.len() < 3)]
    # dff = dff[~(dff.barcode.str.len() > 25)]
    dff = dff.drop_duplicates(subset=['Barcode'], keep='first')
    return dff


# %%
df = cleaning(df)

# %%
from inventory.models import *

error_items = []
for index, row in df.iterrows():
    try:
        a = Product.objects.create(product_code=row['Barcode'],
                                   name=row['Product Name'],
                                   cost=row['Purchase Price'],
                                   mrp=row['M.R.P.'],
                                   discount_price=row['Sales Price'],
                                   company=row['Company']
                                   )

        if row['Unit'] == 'PCS' or row['Unit'] == 'PACK':
            a.quantity_unit = row['Unit']
        else:
            a.quantity_unit = None
        if int(row['Current Stock']) < 0:
            a.quantity = 0
        else:
            a.quantity = int(row['Current Stock'])

        a.save()
        print('done{}'.format(index))
    except:
        error_items.append(row['code'])

# %%  ASSIGN Company
from inventory.models import *

# company = ProductCompany.objects.get(name="ITC")
products = Product.objects.all()
# products.name = "SUJI 500g"
# print(products.brand)
# products.save()
for product in products:
    company, created = ProductCompany.objects.get_or_create(
        name=product.company,
    )
    product.brand = company
    product.save()
    # print(product.company, product.brand)
