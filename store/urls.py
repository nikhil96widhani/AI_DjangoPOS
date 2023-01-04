from django.urls import path

from . import views

urlpatterns = [
    path('', views.home_page, name='store_home_page'),
    path('items-list/', views.items_list, name='store_items_list'),
    path('item-detail/', views.item_detail, name='store_item_detail'),
]