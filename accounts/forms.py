from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.db import transaction
from .models import *
from django import forms
from ckeditor.widgets import CKEditorWidget
from django.forms.widgets import ClearableFileInput


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
    # weburls = WebUrlsForm()

    class Meta:
        model = SiteConfiguration
        fields = ('shop_name', 'address', 'country_located', 'email', 'phone_number', 'currency', 'receipt_message',
                  'receipt_tnc', 'about_us', 'whatsapp_number', 'instagram', 'facebook', 'youtube', 'twitter', 'shop_logo')
        shop_logo = forms.ImageField(error_messages={'invalid': "Image files only"},
                                     widget=forms.FileInput(attrs={'class': 'form-control'}))

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
            # 'shop_logo': forms.ClearableFileInput(attrs={'class': 'form-control'}),

            'about_us': forms.Textarea(attrs={'class': 'ckeditor form-control'}),

            'instagram': forms.URLInput(attrs={'class': ' form-control'}),
            'facebook': forms.URLInput(attrs={'class': ' form-control'}),
            'youtube': forms.URLInput(attrs={'class': ' form-control'}),
            'twitter': forms.URLInput(attrs={'class': ' form-control'}),

        }
