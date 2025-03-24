# # uploads/models.py
# from django.db import models

from django.contrib.gis.db import models
from .tasks import generate_tiles_task
import os
from django.conf import settings


class DocumentData(models.Model):
    file = models.FileField(upload_to='uploads/%Y/%m/%d/')
    description = models.TextField()
    date_captured = models.DateField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name
    
class MapData(models.Model):
    file = models.FileField(upload_to='uploads/%Y/%m/%d/')
    description = models.TextField()
    date_captured = models.DateField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name


class GeospatialData(models.Model):
    file = models.FileField(upload_to='geotiffs/')
    data_type = models.CharField(max_length=100)
    type_of_data = models.CharField(max_length=100)
    description = models.TextField()
    date_captured = models.DateField()
    tiles_generated = models.BooleanField(default=False)
    tile_path = models.CharField(max_length=255, null=True, blank=True)  # Stores path to tiles

    def __str__(self):
        return f"{self.file.name} ({self.date_captured})"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.file and not self.tiles_generated:
            output_dir = os.path.join(settings.MEDIA_ROOT, 'tiles', str(self.id))
            os.makedirs(output_dir, exist_ok=True)
            generate_tiles_task.delay(self.file.path, output_dir, self.id)

