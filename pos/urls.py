from django.urls import path
# from . import views
from .views import *
from django.contrib.auth.views import LoginView, LogoutView

urlpatterns = [
    path('', pos_homeView, name='pos-home'),
    path('datatable', cart_datatable_view, name='cart-datatable'),
    path('receipt/<int:pk>', receiptView, name='receipt'),
    path('product-label/<str:pk>', productLabelView, name='product-label'),
    path('product-expiry-label', productExpLabelView, name='product-expiry-label'),
]
