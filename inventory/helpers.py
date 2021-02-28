
def calculateDiscountPrice(value, percentage):
    discount = value - (value * percentage / 100.0)
    return round(discount, 2)
