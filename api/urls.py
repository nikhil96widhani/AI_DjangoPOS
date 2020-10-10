from django.urls import path
from .pos_views import *

urlpatterns = [
    path('cart/', Cart.as_view(), name='cart'),
    path('product-categories/', ProductCategoryList.as_view(), name='product-category-get-post'),
    path('product-categories/<int:pk>/', ProductCategoryDetail.as_view(), name='product-category-update-delete'),
    path('products/', ProductList.as_view(), name='product-get-post'),
    path('products/<int:pk>/', ProductDetail.as_view(), name='product-update-delete'),
]
