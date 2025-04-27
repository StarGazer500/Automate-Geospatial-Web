# # uploads/admin.py
# from django.contrib.gis import admin
# # uploads/admin.py
from django.contrib import admin
from .models import GeospatialData,DocumentData,MapData,AnalysispData,Departments,Role,DepartmentStaff

# Register your models here.
admin.site.register(GeospatialData)
admin.site.register(DocumentData)
admin.site.register(MapData)
admin.site.register(AnalysispData)
admin.site.register(Departments)
admin.site.register(Role)
admin.site.register(DepartmentStaff)