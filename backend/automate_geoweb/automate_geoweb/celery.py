# automate_geoweb/celery.py
import os
from celery import Celery

# Set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'automate_geoweb.settings')

# Create Celery app instance
app = Celery('automate_geoweb')

# Load task modules from all registered Django apps
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks in all apps (e.g., uploads.tasks)
app.autodiscover_tasks()