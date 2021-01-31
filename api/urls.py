from django.urls import path
from .pos_views import *
from .report_views import *
from .report_views import OrdersListView

urlpatterns = [
    path('cart/', Cart.as_view(), name='cart'),
    path('cart-datatable/', CartListView.as_view(), name='api-cart-datatable'),
    path('product-categories/', ProductCategoryList.as_view(), name='product-category-get-post'),
    path('product-categories/<int:pk>/', ProductCategoryDetail.as_view(), name='product-category-update-delete'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('add-product/', add_product, name='post-product'),
    path('products/<str:pk>/', product_detail, name='product-detail'),
    path('product-code-generator/', ProductCodeGeneratorView.as_view(), name='product-code-generator'),
    path('search-products/', search_products, name='search-products'),
    path('orders/', OrdersView.as_view(), name='api-orders'),
    path('orders/<int:pk>/', order_detail, name='api-order-detail'),
    path('orders-datatable/', OrdersListView.as_view(), name='api-orders-datatable'),
    path('order-items/', OrderItemsView.as_view(), name='api-orders-items'),
    path('orders-chart-data/', OrdersChartDataView.as_view(), name='api-orders-chart-data'),
    path('product-companies/', ProductCompaniesView.as_view(), name='api-products-companies'),

    path('add-product-with-variation/', add_product_with_variation, name='post-product-with-variation'),
    path('variations/<int:pk>/', variation_detail, name='variation-detail'),
    path('products_new/<str:pk>/', ProductDetail.as_view(), name='product-new-detail'),
    path('variations/', ProductVariationListView.as_view(), name='variations-list'),
]
