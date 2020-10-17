from django.urls import path
# from . import views
from .views import *
from django.contrib.auth.views import LoginView, LogoutView

urlpatterns = [
    path('', pos_homeView, name='pos-home'),
    path('receipt/<int:pk>', receiptView, name='receipt'),
    path('product-label/<int:pk>', productLabelView, name='product-label'),
]
