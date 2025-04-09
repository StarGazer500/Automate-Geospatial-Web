# # uploads/models.py
# from django.db import models

from django.contrib.gis.db import models
from .tasks import generate_tiles_task,generate_geo_thumbnail
import os
from django.conf import settings
from pathlib import Path
from asgiref.sync import sync_to_async


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
    files_dir = models.CharField(max_length=100, default="No File Dir")
    tiles_path = models.CharField(max_length=100, null=True, blank=True)
    data_type = models.CharField(max_length=100)
    type_of_data = models.CharField(max_length=100)
    description = models.TextField()
    date_captured = models.DateField()
    tiles_generated = models.BooleanField(default=False)
    thumbnails_dir = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.files_dir} ({self.date_captured})"

    def delete(self, *args, **kwargs):
        tile_path = os.path.join(settings.MEDIA_ROOT, self.tiles_path) if self.tiles_path else None
        thumbnail_path = os.path.join(settings.MEDIA_ROOT, self.thumbnails_dir) if self.thumbnails_dir else None
        super().delete(*args, **kwargs)
        if tile_path and os.path.exists(tile_path):
            try:
                import shutil
                shutil.rmtree(tile_path)
                logger.info(f"Deleted tiles directory: {tile_path}")
            except Exception as e:
                logger.error(f"Error deleting tiles directory {tile_path}: {e}")
        if thumbnail_path and os.path.exists(thumbnail_path):
            try:
                import shutil
                shutil.rmtree(thumbnail_path)
                logger.info(f"Deleted thumbnails directory: {thumbnail_path}")
            except Exception as e:
                logger.error(f"Error deleting thumbnails directory {thumbnail_path}: {e}")

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        
        # Get the original object if it exists
        if not is_new:
            original = GeospatialData.objects.get(pk=self.pk)
            old_files_dir = original.files_dir
        else:
            old_files_dir = "No File Dir"
        
        # Always ensure we have the directory paths
        if is_new:
            super().save(*args, **kwargs)
            # Set up directories
            output_dir = os.path.join(settings.MEDIA_ROOT, 'tiles', str(self.id))
            os.makedirs(output_dir, exist_ok=True)
            self.tiles_path = os.path.relpath(output_dir, settings.MEDIA_ROOT)
            thumbnail_dir = os.path.join(settings.MEDIA_ROOT, 'thumbnails', str(self.id))
            os.makedirs(thumbnail_dir, exist_ok=True)
            self.thumbnails_dir = os.path.relpath(thumbnail_dir, settings.MEDIA_ROOT)
            # Save directories even if files_dir isn't set yet
            super().save(update_fields=['tiles_path', 'thumbnails_dir'])
        else:
            super().save(*args, **kwargs)
        
        # Queue chain if files_dir is populated and changed from previous value
        if self.files_dir and self.files_dir != "No File Dir" and self.files_dir != old_files_dir:
            # Make sure output_dir is defined even for existing instances
            if 'output_dir' not in locals():
                output_dir = os.path.join(settings.MEDIA_ROOT, 'tiles', str(self.id))
                
            # Make sure thumbnail_dir is defined for existing instances
            if 'thumbnail_dir' not in locals():
                thumbnail_dir = os.path.join(settings.MEDIA_ROOT, 'thumbnails', str(self.id))
                
            directory = Path(os.path.join(settings.MEDIA_ROOT, self.files_dir))
            files = [str(f) for f in directory.iterdir() if f.is_file()]
            logger.info(f"Checking directory {directory} for files: {files}")
            if files:
                for file in files:
                    filename = os.path.basename(file)
                    file_ext = os.path.splitext(filename)[1].lower()
                    if file_ext in ['.dbf', '.prj', '.shx', '.cpg']:
                        continue
                    logger.info(f"Queuing chain from save for file: {file}, id: {self.id}")
                    chain(
                        generate_tiles_task.s(file, output_dir, self.id),
                        generate_geo_thumbnail.s('upload.GeospatialData', self.id, None, self.thumbnails_dir)
                    ).delay()
    # Async save for consumer compatibility
    async def asave(self, *args, **kwargs):
        await sync_to_async(self.save)(*args, **kwargs)

        # if is_new or (self.file and not self.tiles_generated):
        #     output_dir = os.path.join(settings.MEDIA_ROOT, 'tiles', str(self.id))
        #     os.makedirs(output_dir, exist_ok=True)
        #     logger.info(f"Queuing task chain for GeospatialData ID: {self.id}")
            
        #     logger.info("Task chain queued successfully")
                

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
    

