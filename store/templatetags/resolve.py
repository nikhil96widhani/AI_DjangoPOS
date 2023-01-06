from django.template import Variable, VariableDoesNotExist
from django import template

register = template.Library()


@register.simple_tag
def resolve(lookup, target):
    try:
        return Variable(lookup).resolve(target)
    except VariableDoesNotExist:
        return None
