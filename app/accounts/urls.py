from django.urls import path
from .views import *
from django.contrib.auth.views import LoginView, LogoutView

urlpatterns = [
    path('login/', LoginView.as_view(template_name='accounts/login.html'), name='login'),
    path('register/', registerView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(next_page='user-redirect'), name='logout'),
    path('settings/', settingsView, name='settings'),
    path('expenses/', expensesView, name='expenses'),
]
