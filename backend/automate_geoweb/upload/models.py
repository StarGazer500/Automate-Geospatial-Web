# # uploads/models.py
# from django.db import models

from django.contrib.gis.db import models
from .tasks import generate_tiles_task,generate_geo_thumbnail
import os
from django.conf import settings


import logging
logger = logging.getLogger(__name__)
from celery import chain


class DocumentData(models.Model):
    file = models.FileField(upload_to='documentuploads/%Y/%m/%d/')
    description = models.TextField()
    date_captured = models.DateField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)

    def __str__(self):
        return self.file.name
    
class MapData(models.Model):
    file = models.FileField(upload_to='mapuploads/%Y/%m/%d/')
    description = models.TextField()
    date_captured = models.DateField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)

    def __str__(self):
        return self.file.name
    


class GeospatialData(models.Model):
    file = models.FileField(upload_to='geotiffs/%Y/%m/%d/')
    data_type = models.CharField(max_length=100)
    type_of_data = models.CharField(max_length=100)
    description = models.TextField()
    date_captured = models.DateField()
    tiles_generated = models.BooleanField(default=False)
    tile_path = models.CharField(max_length=255, null=True, blank=True)  # Stores path to tiles
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)

    def __str__(self):
        return f"{self.file.name} ({self.date_captured})"

    def delete(self, *args, **kwargs):
        # Store the file path before deletion
        file_path = self.file.path if self.file else None
        tile_path = os.path.join(settings.MEDIA_ROOT, self.tile_path) if self.tile_path else None

        # Call the parent class's delete method
        super().delete(*args, **kwargs)

        # Remove the file from the filesystem
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
                logger.info(f"Deleted file: {file_path}")
            except Exception as e:
                logger.error(f"Error deleting file {file_path}: {e}")

        # Remove the tiles directory
        if tile_path and os.path.exists(tile_path):
            try:
                import shutil
                shutil.rmtree(tile_path)
                logger.info(f"Deleted tiles directory: {tile_path}")
            except Exception as e:
                logger.error(f"Error deleting tiles directory {tile_path}: {e}")

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new or (self.file and not self.tiles_generated):
            output_dir = os.path.join(settings.MEDIA_ROOT, 'tiles', str(self.id))
            os.makedirs(output_dir, exist_ok=True)
            logger.info(f"Queuing task chain for GeospatialData ID: {self.id}")
            chain(
                generate_tiles_task.s(self.file.path, output_dir, self.id),
                generate_geo_thumbnail.si("upload.GeospatialData", self.id)  # Use .si() for immutable signature
            ).delay()
            logger.info("Task chain queued successfully")
                

class AnalysispData(models.Model):
    file = models.FileField(upload_to='analysisuploads/%Y/%m/%d/')
    map_data = models.ForeignKey(MapData,on_delete=models.CASCADE)
    document_data = models.ForeignKey(DocumentData,on_delete=models.CASCADE)
    input_data = models.ForeignKey(GeospatialData, on_delete=models.CASCADE, related_name='input_analysis_data')
    output_data = models.ForeignKey(GeospatialData, on_delete=models.CASCADE, related_name='output_analysis_data')
    description = models.TextField()
    date_captured = models.DateField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)

    def __str__(self):
        return self.file.name
    

