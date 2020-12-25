from xlrd import open_workbook
import inventory.models


def parseSaveXls(file):
    error_items = []
    message = ''
    classalert = ''
    wb = open_workbook(file_contents=file.read())
    sheet_names = wb.sheet_names()
    xl_sheet = wb.sheet_by_name(sheet_names[0])

    for row in range(4, xl_sheet.nrows):
        barcode = xl_sheet.row(row)[-1].value
        name = xl_sheet.row(row)[1].value.strip()
        quantity_unit = xl_sheet.row(row)[2].value
        cost = xl_sheet.row(row)[10].value if xl_sheet.row(row)[10].value else 0
        mrp = xl_sheet.row(row)[9].value if xl_sheet.row(row)[9].value else 0
        discount_price = xl_sheet.row(row)[11].value
        stock = xl_sheet.row(row)[3].value
        company = xl_sheet.row(row)[12].value

        # print(barcode, name, quantity_unit, cost, mrp, discount_price, stock, company)
        if barcode:
            try:
                product, created = inventory.models.Product.objects.get_or_create(
                    product_code=str(barcode),
                )
                product.name = name
                product.cost = cost
                product.mrp = mrp
                product.discount_price = discount_price
                product.company = company

                company, created2 = inventory.models.ProductCompany.objects.get_or_create(
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
                message = "Successfully Updated the data"
                classalert = 'alert-primary'
            except:
                error_items.append(barcode)
                message = "Failed to update data. Please check with file or send file to NIKHIL to see whats wrong"
                classalert = 'alert-danger'
    return {'message': message, 'error_items': error_items, 'class': classalert}


def parseSaveXlsFst(file):
    error_items = []
    message = ''
    classalert = ''
    wb = open_workbook(file_contents=file.read())
    sheet_names = wb.sheet_names()
    xl_sheet = wb.sheet_by_name(sheet_names[0])

    for row in range(4, xl_sheet.nrows):
        barcode = xl_sheet.row(row)[-1].value
        cost = xl_sheet.row(row)[10].value if xl_sheet.row(row)[10].value else 0
        mrp = xl_sheet.row(row)[9].value if xl_sheet.row(row)[9].value else 0
        discount_price = xl_sheet.row(row)[11].value
        # print(barcode, name, quantity_unit, cost, mrp, discount_price, stock, company)
        if barcode:
            try:
                product, created = inventory.models.Product.objects.get_or_create(
                    product_code=str(barcode),
                )
                if created:
                    name = xl_sheet.row(row)[1].value.strip()
                    quantity_unit = xl_sheet.row(row)[2].value
                    cost = xl_sheet.row(row)[10].value if xl_sheet.row(row)[10].value else 0
                    mrp = xl_sheet.row(row)[9].value if xl_sheet.row(row)[9].value else 0
                    discount_price = xl_sheet.row(row)[11].value
                    stock = xl_sheet.row(row)[3].value
                    company = xl_sheet.row(row)[12].value

                    product.name = name
                    product.cost = cost
                    product.mrp = mrp
                    product.discount_price = discount_price
                    product.company = company

                    company, created2 = inventory.models.ProductCompany.objects.get_or_create(
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
                elif not created and product.discount_price != discount_price:
                    product.cost = cost
                    product.mrp = mrp
                    product.discount_price = discount_price

                    product.save()

                message = "Successfully Updated the data"
                classalert = 'alert-primary'
            except:
                error_items.append(barcode)
                message = "Failed to update data. Please check with file or send file to NIKHIL to see whats wrong"
                classalert = 'alert-danger'
    return {'message': message, 'error_items': error_items, 'class': classalert}