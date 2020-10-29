from django.urls import path
from .views import *

urlpatterns = [
    path('', orders_view, name='orders'),
    path('daily-stats', daily_stats, name='stats'),
]
