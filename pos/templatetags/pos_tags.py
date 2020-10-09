from django import template

register = template.Library()


@register.filter(name='price_format')
def price_format(num):
    if num % 1 == 0:
        return int(num)
    else:
        return num
