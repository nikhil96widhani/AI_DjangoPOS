# %%
import pandas as pd

# %%
df = pd.read_csv('Helper Functions/stock_1.csv')


# %%

def cleaning(dff):
    dff = dff.dropna(subset=['barcode'])
    # dff[dff.stock < 0] = 0
    dff['barcode'] = dff['barcode'].astype(str)
    # dff = dff[~(dff.barcode.str.len() < 3)]
    # dff = dff[~(dff.barcode.str.len() > 25)]
    dff = dff.drop_duplicates(subset=['barcode'], keep='first')
    return dff


# %%
df = cleaning(df)

# %%
from inventory.models import *

error_items = []
for index, row in df.iterrows():
    try:
        a = Product.objects.create(product_code=row['barcode'],
                                   name=row['product_name'],
                                   cost=row['purchase_price'],
                                   mrp=row['mrp'],
                                   discount_price=row['sales_price'],
                                   company=row['company']
                                   )

        if row['stock'] == 'PCS' or row['stock'] == 'PACK':
            a.quantity_unit = row['unit']
        else:
            a.quantity_unit = None
        if int(row['stock']) < 0:
            a.quantity = 0
        else:
            a.quantity = int(row['stock'])

        a.save()
        print('done{}'.format(index))
    except:
        error_items.append(row['code'])
