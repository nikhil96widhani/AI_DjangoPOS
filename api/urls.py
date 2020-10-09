from django.urls import path
from .pos_views import *

urlpatterns = [
    path('cart/', Cart.as_view(), name='cart'),
]
