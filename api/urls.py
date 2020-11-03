from django.urls import path
from .pos_views import *

urlpatterns = [
    path('cart/', Cart.as_view(), name='cart'),
    path('product-categories/', ProductCategoryList.as_view(), name='product-category-get-post'),
    path('product-categories/<int:pk>/', ProductCategoryDetail.as_view(), name='product-category-update-delete'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<str:pk>/', product_detail, name='product-detail'),
    path('product-code-generator/', ProductCodeGeneratorView.as_view(), name='product-code-generator'),
]
