from django.urls import path

from . import views

# urlpatterns = [
#     path('', views.home_page, name='store_home_page'),
#     path('items-list/', views.items_list, name='store_items_list'),
#     path('item-detail/', views.item_detail, name='store_item_detail'),
# ]
urlpatterns = [
    path('', views.home_page, name='store_home_page'),
    path('signup', views.user_signup, name='store_user_signup'),
    path('login', views.user_login, name='store_user_login'),
    path('logout', views.user_logout, name='store_user_logout'),
    path('profile', views.user_profile, name='store_user_profile'),
    path('items-list', views.items_list, name='store_items_list'),
    path('item-detail/', views.item_detail, name='store_item_detail'),
    path('order-cart', views.order_cart, name='store_order_cart'),
    path('order-form', views.order_form, name='store_order_form'),
    path('about-us', views.about_us, name='store_about_us'),
    path('help-center', views.help_center, name='store_help_center'),
    path('whislist/', views.user_wishlist, name='store_user_wishlist'),
]
