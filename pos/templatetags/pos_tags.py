from django import template

register = template.Library()


@register.filter(name='price_format')
def price_format(num):
    try:
        if num % 1 == 0:
            return int(num)
        else:
            return num
    except:
        return num


@register.filter(name='subtract')
def subtract(value, arg):
    return value - arg
