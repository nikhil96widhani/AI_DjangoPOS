from django.contrib.auth import get_user_model

from celery import shared_task
from django.core.mail import send_mail
from AI_DjangoPos import settings
from django.utils import timezone
from datetime import timedelta
import owncloud
from django.conf import settings


@shared_task(bind=True)
def backup_everyday(self):
    public_link = 'https://cloud.nikhilwidhani.com/s/8mZ69ib85zWojeR'
    try:
        oc = owncloud.Client.from_public_link(public_link)
        oc.drop_file(settings.BASE_DIR / 'db.sqlite3')
        # oc.drop_file('C:/Users/HP/Desktop/pycharm_project/django_celery/db.sqlite3')
        print("[SUCCESS] db backup")
    except:
        print('[FAILED] db backup')

    # users = get_user_model().objects.all()
    # #timezone.localtime(users.date_time) + timedelta(days=2)
    # for user in users:
    #     mail_subject = "Hi! Celery Testing"
    #     message = "If you are liking my content, please hit the like button and do subscribe to my channel"
    #     to_email = user.email
    #     send_mail(
    #         subject = mail_subject,
    #         message=message,
    #         from_email=settings.EMAIL_HOST_USER,
    #         recipient_list=[to_email],
    #         fail_silently=True,
    #     )
    # return "Done"
