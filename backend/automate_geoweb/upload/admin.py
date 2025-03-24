# # uploads/admin.py
# from django.contrib.gis import admin
# # uploads/admin.py
from django.contrib import admin
from .models import GeospatialData

# Register your models here.
admin.site.register(GeospatialData)
