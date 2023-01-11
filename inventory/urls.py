from django.urls import path
# from . import views
from .views import *
from django.contrib.auth.views import LoginView, LogoutView

urlpatterns = [
    # path('', indexView.as_view(), name='home'),
    # path('', homeView, name='home'),
    path('update-inventory/', updateInventoryView, name='update-inventory'),
    path('products/', products_view, name='products'),
    # path('add-product/', add_product_view, name='add-product'),
    path('update-inventory-by-bill/', updateInventoryByBill, name='update-inventory-by-bill'),
    path('stock-bills-datatable/', stock_bills_datatable_view, name='stock-bills-datatable'),
]
