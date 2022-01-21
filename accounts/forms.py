from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.db import transaction
from .models import *
from django import forms
from ckeditor.widgets import CKEditorWidget
from django.contrib.auth import password_validation
from django.forms.widgets import ClearableFileInput

class CustomUserCreationForm(UserCreationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["password1"].widget.attrs["label"] = "Password"
        for field in self.fields.values():
            field.widget.attrs["class"] = "form-control"

    password1 = forms.CharField(
        label='Password',
        strip=False,
        widget=forms.PasswordInput(),
        help_text=password_validation.password_validators_help_text_html(),
    )

    password2 = forms.CharField(
        label='Confirm Password',
        strip=False,
        widget=forms.PasswordInput(),
        help_text="Enter same password as above.",
    )

    class Meta:
        model = User
        fields = ('username', 'firstname', 'lastname', 'email', 'phone')
        # widgets = {
        #     'username': forms.TextInput(attrs={'class': 'form-control', 'id': 'floatingInput', 'placeholder': 'enter username'}),
        #     'firstname': forms.TextInput(attrs={'class': 'form-control'}),
        #     'lastname': forms.TextInput(attrs={'class': 'form-control'}),
        #     'email': forms.EmailInput(attrs={'class': 'form-control'}),
        #     'phone': forms.TextInput(attrs={'class': 'form-control'}),
        #     'password2': forms.TextInput(attrs={'placeholder' : 'hi1',
        #                                              'class' : 'form-control'
        #                                              })
        # }
    # password1 = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'hi',
    #                                                           'class': 'form-control'
    #


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ('username', 'firstname', 'lastname', 'email', 'phone')


class SettingsForm(forms.ModelForm):
    # receipt_tnc = forms.CharField(widget=CKEditorWidget())
    # shop_logo = forms.ImageField(
    #     widget=forms.ClearableFileInput
    # )
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
            # 'shop_logo': forms.ImageField(attrs={'class': 'custom-file-input'})
        }
