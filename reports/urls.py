from django.urls import path
from .views import *

urlpatterns = [
    path('', orders_view, name='orders'),
    path('dashboard', dashboard_view, name='dashboard'),
    path('orders-datatable', orders_datatable_view, name='orders-datatable'),
    path('daily-stats', daily_stats, name='stats'),
]
