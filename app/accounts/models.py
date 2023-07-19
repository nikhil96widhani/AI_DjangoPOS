from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from solo.models import SingletonModel
from ckeditor.fields import RichTextField


# Create your models here.
# A custom user model needs a user manager
class UserManager(BaseUserManager):
    def create_user(self, email, username, firstname, lastname, password=None):
        if not email:
            raise ValueError("Users must have a valid email address")
        if not username:
            raise ValueError("Users must have a unique username")
        if not firstname:
            raise ValueError("Users must have a first name")
        if not lastname:
            raise ValueError("Users must have a last name")

        user = self.model(
            email=self.normalize_email(email),
            username=username,
            firstname=firstname,
            lastname=lastname,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, firstname, lastname, password):
        if not email:
            raise ValueError("User must have an email")
        if not password:
            raise ValueError("User must have a password")

        user = self.model(
            email=self.normalize_email(email)
        )
        user.username = username
        user.firstname = firstname
        user.lastname = lastname
        user.set_password(password)
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    email = models.EmailField(verbose_name="email", max_length=60, unique=True)
    username = models.CharField(max_length=30, unique=True)
    firstname = models.CharField(max_length=30)
    lastname = models.CharField(max_length=30)
    phone = models.CharField(max_length=20)
    # These are required for the AbstractBaseUser class by Django
    date_joined = models.DateTimeField(verbose_name="date joined", auto_now_add=True)
    last_login = models.DateTimeField(verbose_name="last login", auto_now=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    # In a custom field, we need to set the field by which
    # users log in with. Here we want to use email.
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'firstname', 'lastname']

    # Tell the user model where the user manager is
    objects = UserManager()

    class Meta:
        db_table = "users"
        verbose_name = "user"
        verbose_name_plural = "users"

    def __str__(self):
        return '{} {}'.format(self.firstname, self.lastname)

    # These functions are required in a custom user model
    # This sets permissions
    def has_perm(self, perm, obj=None):
        return self.is_admin

    @staticmethod
    def has_module_perms(app_label):
        return True


# https://github.com/lazybird/django-solo

class WebUrls(models.Model):
    instagram = models.URLField(null=True, blank=True)
    facebook = models.URLField(null=True, blank=True)
    youtube = models.URLField(null=True, blank=True)
    twitter = models.URLField(null=True, blank=True)

    def __str__(self):
        return "Website URLs"


class SiteConfiguration(SingletonModel):
    # Shop Fields
    shop_name = models.CharField(max_length=255, blank=True, null=True, default='Shop Name')
    address = models.CharField(max_length=100, blank=True, null=True, default='Bhopal, India')
    country_located = models.CharField(max_length=20, blank=True, null=True, default='India')
    email = models.EmailField(blank=True, null=True, default='admin@site.com')
    phone_number = models.IntegerField(blank=True, null=True, default='1111111111')
    whatsapp_number = models.IntegerField(blank=True, null=True, default='1111111111')

    # Payment Fields

    # Receipt Fields
    # tnc = models.CharField(max_length=5, null=True)
    receipt_message = models.CharField(max_length=100, blank=True, null=True, default='Thank you for shopping')
    receipt_tnc = RichTextField(blank=True, null=True, default='<li>No Return on goods sold</li>')

    about_us = RichTextField(blank=True, null=True, default='Welcome to our website.')
    shop_logo = models.ImageField(default='images/default_shop_logo.jpg', null=True, blank=True, upload_to="images/")

    def __str__(self):
        return "Site Configuration"

    class Meta:
        verbose_name = "Site Configuration"


class CurrencyChoice(models.TextChoices):
    Rupees = "₹", "INR"
    Canadian_dollar = "$", "CAD"


class StoreSettings(SingletonModel):
    currency = models.CharField(
        max_length=2,
        choices=CurrencyChoice.choices,
        default=CurrencyChoice.Rupees
    )
    #config.get_currency_display()
    # config.currency

    # Shop Fields
    site_name = models.CharField(max_length=255, blank=True, null=True, default='Shop Name')
    tagline = RichTextField(blank=True, null=True)
    address = models.CharField(max_length=100, blank=True, null=True, default='Bhopal, India')
    country_located = models.CharField(max_length=20, blank=True, null=True, default='India')
    email = models.EmailField(blank=True, null=True, default='admin@site.com')
    phone_number = models.IntegerField(blank=True, null=True, default='1111111111')
    contact_hours = models.CharField(max_length=255, blank=True, null=True, default='(9-13 and 14-18 ; Mon-Fri)')
    whatsapp_number = models.IntegerField(blank=True, null=True, default='1111111111')

    site_about_us = RichTextField(blank=True, null=True, default='Welcome to our website.')
    site_logo = models.ImageField(default='images/default_shop_logo.jpg', null=True, blank=True,
                                  upload_to="images/site_logo")
    homepage_image = models.ImageField(default='images/default_shop_logo.jpg', null=True, blank=True,
                                       upload_to="images/homeepage_image")

    menu_maker = models.CharField(max_length=255, blank=True, null=True)

    # Weburls
    instagram = models.URLField(null=True, blank=True)
    facebook = models.URLField(null=True, blank=True)
    youtube = models.URLField(null=True, blank=True)
    twitter = models.URLField(null=True, blank=True)

    def __str__(self):
        return "Website Configuration"

    class Meta:
        verbose_name = "Website Configuration"


class PosCustomer(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    phone_number = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.name
