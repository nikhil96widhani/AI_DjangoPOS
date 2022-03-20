from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.contrib.auth import password_validation
from accounts.models import User


class CustomerCreationForm(UserCreationForm):

    class Meta:
        model = User
        fields = ('username', 'firstname', 'lastname', 'email', 'phone', 'password1', 'password2')
