import django_filters
from inventory.models import *


class InFilter(django_filters.BaseInFilter, django_filters.CharFilter):
    pass


class NumberRangeFilter(django_filters.BaseRangeFilter, django_filters.NumberFilter):
    pass


class ProductFilter(django_filters.FilterSet):
    # category__in = django_filters.CharFilter(field_name='category', lookup_expr='in')
    category__in = InFilter(field_name='category', lookup_expr='in')
    cost = NumberRangeFilter(field_name='productvariation__cost', lookup_expr='range')

    # category_in = django_filters.BaseInFilter(field_name='category', lookup_expr='in')

    class Meta:
        model = Product
        fields = ['category', 'productvariation__cost', 'productvariation__id']
