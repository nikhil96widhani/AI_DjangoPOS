from .models import *


def get_site_context(request):
    site = SiteConfiguration.objects.first()
    return {
        'site': site
    }


# def get_user_context(request):
#     if request.user.is_authenticated:
#         return {
#             'site': request.user
#         }
