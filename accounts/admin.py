from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


class CustomAdmin(UserAdmin):
    list_display = ('email', 'username', 'date_joined', 'last_login', 'id', 'is_admin')
    search_fields = ('email', 'username')
    readonly_fields = ('date_joined', 'last_login')

    # These are required
    filter_horizontal = ()
    list_filter = ()
    fieldsets = ()


admin.site.register(User, CustomAdmin)
