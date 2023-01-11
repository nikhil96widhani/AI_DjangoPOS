from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.db import transaction
from .models import *
from django import forms
from ckeditor.widgets import CKEditorWidget


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('username', 'firstname', 'lastname', 'email', 'phone')


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ('username', 'firstname', 'lastname', 'email', 'phone')


class SettingsForm(forms.ModelForm):
    # receipt_tnc = forms.CharField(widget=CKEditorWidget())

    class Meta:
        model = SiteConfiguration
        fields = '__all__'

        widgets = {
            'shop_name': forms.TextInput(attrs={'class': 'form-control'}),
            'address': forms.TextInput(attrs={'class': 'form-control'}),
            'country_located': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.TextInput(attrs={'class': 'form-control'}),
            'phone_number': forms.NumberInput(attrs={'class': 'form-control'}),
            'whatsapp_number': forms.NumberInput(attrs={'class': 'form-control'}),

            'currency': forms.Select(attrs={'class': 'form-control'}),

            'receipt_message': forms.TextInput(attrs={'class': 'form-control'}),
            'receipt_tnc': forms.Textarea(attrs={'class': 'ckeditor form-control'}),
        }
