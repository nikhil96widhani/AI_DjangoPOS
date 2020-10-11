from django.urls import path
# from . import views
from .views import *
from django.contrib.auth.views import LoginView, LogoutView

urlpatterns = [
    # path('', indexView.as_view(), name='home'),
    path('', homeView, name='home'),
    path('products/', productsView, name='products'),
]
