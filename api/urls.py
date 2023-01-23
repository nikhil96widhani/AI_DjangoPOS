from django.urls import path, re_path

from .cart_views import handle_order, CartListView
from .pos_views import *
from .report_views import *
from .inventory_views import *

cart_urls = [
    # path('cart/', Cart.as_view(), name='cart'),
    # path('cart-datatable/', CartListView.as_view(), name='api-cart-datatable'),
    path('cart-datatable/', CartListView.as_view(), name='api-cart-datatable'),
    path('handle-order/', handle_order, name='handle-order'),
]

product_urls = [
    path('product-categories/', ProductCategoryList.as_view(), name='product-category-get-post'),
    path('product-categories/<int:pk>/', ProductCategoryDetail.as_view(), name='product-category-update-delete'),

    path('products/', ProductListView.as_view(), name='product-list'),
    # path('add-product/', add_product, name='post-product'),
    # path('products/<str:pk>/', product_detail, name='product-detail'),

    path('product-code-generator/', ProductCodeGeneratorView.as_view(), name='product-code-generator'),
    # path('search-products/', search_products, name='search-products'),
    path('product-variation-search/', searchProductVariations, name='product-variation-search'),
    path('add-product-with-variation/', add_product_with_variation, name='post-product-with-variation'),
    path('variations/<int:pk>/', variation_detail, name='variation-detail'),
    path('products/<str:pk>/', ProductDetail.as_view(), name='product-detail'),
    path('variations/', ProductVariationListView.as_view(), name='variations-list'),
    path('product-and-variations/', variations_data_using_product_code, name='product-and-variations'),
    path('product-companies/', ProductCompaniesView.as_view(), name='api-products-companies'),
    path('products-by-category/', ProductsByCategory.as_view(), name='products-by-category'),
    # path('products-by-category/<str:category>', ProductsByCategory.as_view(), name='products-by-category'),
    path('', SomethingAPIView.as_view(), name='something'),
    # re_path(r'^$', SomethingAPIView.as_view(), name='something'),
]

order_urls = [
    path('orders/', OrdersView.as_view(), name='api-orders'),
    # path('orders/<int:pk>/', order_detail, name='api-order-detail'),
    path('orders-datatable/', OrdersListView.as_view(), name='api-orders-datatable'),
    path('order-items/', OrderItemsView.as_view(), name='api-orders-items'),
    path('orders-chart-data/', OrdersChartDataView.as_view(), name='api-orders-chart-data'),
]

stock_bill_urls = [
    path('stock-bill/', StockBillApiView.as_view(), name='stock-bill'),
    path('stock-bill-items/', StockBillItemsView.as_view(), name='api-stock-bill-items'),
    path('stock-bills-datatable/', StockBillsListView.as_view(), name='api-stock-bills-datatable'),
    path('add-bill-item/', add_bill_item, name='add-bill-item'),
    path('vendor-list/', VendorListView.as_view(), name='api-vendor-list'),
]

urlpatterns = [*cart_urls, *product_urls, *order_urls, *stock_bill_urls]
