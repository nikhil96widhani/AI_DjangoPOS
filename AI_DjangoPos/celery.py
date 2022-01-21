import os

from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AI_DjangoPos.settings')

app = Celery('AI_DjangoPos')

app.conf.enable_utc = False
app.conf.update(timezone='Asia/Kolkata')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# celery worker command
# celery -A AI_DjangoPos.celery worker --pool=solo -l info

# celery beat command
# celery -A AI_DjangoPos beat -l INFO

# Celery Beat Settings
app.conf.beat_schedule = {
    'backup_everyday_at_8': {
        'task': 'accounts.tasks.backup_everyday',
        'schedule': crontab(hour=8, minute=00),
        # 'args': (2,)
    }
}

# Load task modules from all registered Django apps.
app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
