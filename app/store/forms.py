from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django import forms
from django.contrib.auth import password_validation
from accounts.models import User


class UserSignUpForm(UserCreationForm):

    class Meta:
        model = User
        fields = ('username', 'firstname', 'lastname', 'email', 'phone', 'password1', 'password2')


class UserLoginForm(AuthenticationForm):

    class Meta:
        model = User
        fields = ('username', 'password')