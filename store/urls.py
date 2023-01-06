from django.urls import path

from . import views

urlpatterns = [
    path('', views.home_page, name='store_home_page'),
    path('signup', views.user_signup, name='store_user_signup'),
    path('profile', views.user_profile, name='store_user_profile'),
    path('items-list', views.items_list, name='store_items_list'),
    path('item-detail/<int:pk>', views.item_detail, name='store_item_detail'),
    path('order-cart', views.order_cart, name='store_order_cart'),
    path('order-form', views.order_form, name='store_order_form'),
]
