from django.urls import path

from . import views

urlpatterns = [
    path('', views.home_page, name='store_home_page'),
]