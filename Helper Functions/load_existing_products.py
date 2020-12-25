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

# %%  xml parser
from xlrd import open_workbook
from inventory.models import *

error_items = []
wb = open_workbook('Helper Functions/stock_1.xls', 'r')
sheet_names = wb.sheet_names()
xl_sheet = wb.sheet_by_name(sheet_names[0])

for row in range(4, xl_sheet.nrows):
    barcode = xl_sheet.row(row)[-1].value
    name = xl_sheet.row(row)[1].value
    quantity_unit = xl_sheet.row(row)[2].value
    cost = xl_sheet.row(row)[10].value if xl_sheet.row(row)[10].value else 0
    mrp = xl_sheet.row(row)[9].value if xl_sheet.row(row)[9].value else 0
    discount_price = xl_sheet.row(row)[11].value
    stock = xl_sheet.row(row)[3].value
    company = xl_sheet.row(row)[12].value

    print(barcode, name, quantity_unit, cost, mrp, discount_price, stock, company)
    if barcode:
        try:
            product, created = Product.objects.get_or_create(
                product_code=str(barcode),
            )

            product.name = name
            product.cost = cost
            product.mrp = mrp
            product.discount_price = discount_price
            product.company = company

            company, created2 = ProductCompany.objects.get_or_create(
                name=company,
            )
            product.brand = company

            if quantity_unit == 'PCS' or quantity_unit == 'PACK':
                product.quantity_unit = quantity_unit
            else:
                product.quantity_unit = None

            if int(stock) < 0:
                product.quantity = 0
            else:
                product.quantity = int(stock)

            product.save()
            print('done{}'.format(row))
        except:
            error_items.append(barcode)
    # print(product.product_code. product.quantity_unit, product.cost, product.mrp, product.discount_price,
    #       product.quantity, product.brand.name)


    # print(xl_sheet.row(row)[-1].value, xl_sheet.row(row)[1].value)

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
