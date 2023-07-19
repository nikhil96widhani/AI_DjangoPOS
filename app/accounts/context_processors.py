from .models import *


def get_site_context(request):
    website = StoreSettings.objects.first()
    return {
        'website': website
    }


# def get_user_context(request):
#     if request.user.is_authenticated:
#         return {
#             'site': request.user
#         }
