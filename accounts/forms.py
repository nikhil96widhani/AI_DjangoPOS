from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate
from .models import User


class RegistrationForm(UserCreationForm):
    email = forms.EmailField(max_length=60, help_text='Use a valid email address')

    class Meta:
        model = User
        fields = ('email', 'username', 'firstname', 'lastname', 'phone', 'password1', 'password2')


class UserAuthenticationForm(forms.ModelForm):
    password = forms.CharField(label="password", widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ['email', 'password']

    # This intercepts the form and it has to run this method or any logic here first
    # We are using this for validation
    def clean(self):
        if self.is_valid():
            email = self.cleaned_data['email']
            password = self.cleaned_data['password']
            if not authenticate(email=email, password=password):
                raise forms.ValidationError("Please enter a correct username and password.")


class UserUpdateForm(forms.ModelForm):
    email = forms.EmailField()

    class Meta:
        model = User
        # Specifying these fields let the form know we want to work with those
        fields = ['username', 'email', 'firstname', 'lastname', 'phone']


