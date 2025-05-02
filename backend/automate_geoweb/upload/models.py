# # uploads/models.py
# from django.db import models

from django.contrib.gis.db import models
from .tasks import generate_tiles_task,generate_geo_thumbnail,generate_embedding_task
import os
from django.conf import settings
from pathlib import Path
from asgiref.sync import sync_to_async
from pgvector.django import VectorField,HnswIndex
import logging
logger = logging.getLogger(__name__)
from celery import chain


class Departments(models.Model):
    name=models.CharField(max_length=100,blank=False,null=False)
    description=models.CharField(max_length=100)
    date_created= models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# class CompactmentIdentifier(models.Model):
#     name = models.CharField(max_length=100)
#     description=models.CharField(max_length=100)
#     date_created= models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.file.name
    
class Role(models.Model):
    name=models.CharField(max_length=100,unique=True)
  

    
class DepartmentStaff(models.Model):
    first_name=models.CharField(max_length=100)
    middle_name=models.CharField(max_length=100,blank=True, null=True)
    last_name =models.CharField(max_length=100)
    profession=models.CharField(max_length=100)
    qualification=models.CharField(max_length=100)
    email=models.EmailField(max_length=100,unique=True,default="kojo@gmail.com")
    password = models.CharField(max_length=100,default="No Password")
    role=models.ManyToManyField(Role,blank=True)
    department=models.ForeignKey(Departments,on_delete=models.SET_NULL,null=True,blank=True)

    
# map_data = models.ForeignKey(MapData,on_delete=models.CASCADE)
class DocumentData(models.Model):
    staff = models.ForeignKey(DepartmentStaff,on_delete=models.SET_NULL,null=True,blank=True)
    file = models.FileField(upload_to='documentuploads/%Y/%m/%d/')
    description = models.TextField()
    date_captured = models.DateField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)
    desc_embedding = VectorField(dimensions=384, null=True, blank=True)

    def __str__(self):
        return self.file.name
    
    def save(self, *args, **kwargs):
     
        is_new = self.pk is None
        
        # Get original description if existing object
        if not is_new:
            original = DocumentData.objects.get(pk=self.pk)
            old_description = original.description
        else:
            old_description = ""
     
        super().save(*args, **kwargs)

        if self.description and (is_new or old_description != self.description):
           
            logger.debug(f"Triggering embedding generation for DocumentData ID: {self.pk}")
            generate_embedding_task.delay(self.pk, 'upload.DocumentData')
         
        
        else:
            logger.debug(f"Skipping embedding generation for DocumentData ID: {self.pk} (update_embedding=False)")

    async def asave(self, *args, **kwargs):
        await sync_to_async(self.save)(*args, **kwargs)

    class Meta:
        indexes = [
           HnswIndex(
                name='documentdata_desc_idx',
                fields=['desc_embedding'],
                m=16,
                ef_construction=64,
                opclasses=['vector_cosine_ops'],
            ),
        ]
            
    
class MapData(models.Model):
    staff = models.ForeignKey(DepartmentStaff,on_delete=models.SET_NULL,null=True,blank=True)
    file = models.FileField(upload_to='mapuploads/%Y/%m/%d/')
    description = models.TextField()
    date_captured = models.DateField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)
    desc_embedding = VectorField(dimensions=384, null=True, blank=True)

    def __str__(self):
        return self.file.name
    
    # For the DocumentData model:
    def save(self, *args, **kwargs):
     
        is_new = self.pk is None
        
        # Get original description if existing object
        if not is_new:
            
            original = MapData.objects.get(pk=self.pk)
            old_description = original.description
           
        else:
            old_description = ""
       
        
        
        
        super().save(*args, **kwargs)

        if self.description and (is_new or old_description != self.description):
          
            logger.debug(f"Triggering embedding generation for MapData ID: {self.pk}")
            generate_embedding_task.delay(self.pk, 'upload.MapData')
        
        
        else:
            
            logger.debug(f"Skipping embedding generation for MapData ID: {self.pk} (update_embedding=False)")
    
    async def asave(self, *args, **kwargs):
        await sync_to_async(self.save)(*args, **kwargs)


    class Meta:
        indexes = [
           HnswIndex(
                name='mapdata_desc_idx',
                fields=['desc_embedding'],
                m=16,
                ef_construction=64,
                opclasses=['vector_cosine_ops'],
            ),
        ]
    
   
      
        
    


class GeospatialData(models.Model):
    staff = models.ForeignKey(DepartmentStaff,on_delete=models.SET_NULL,null=True,blank=True)
    files_dir = models.CharField(max_length=100, default="No File Dir")
    tiles_path = models.CharField(max_length=100, null=True, blank=True)
    data_type = models.CharField(max_length=100)
    type_of_data = models.CharField(max_length=100)
    description = models.TextField()
    date_captured = models.DateField()
    tiles_generated = models.BooleanField(default=False)
    thumbnails_dir = models.CharField(max_length=100, blank=True, null=True)
    desc_embedding = VectorField(dimensions=384, null=True, blank=True)

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
            old_description = original.description
        else:
            old_files_dir = "No File Dir"
            old_description = ""
        
        if is_new:
            super().save(*args, **kwargs)
            output_dir = os.path.join(settings.MEDIA_ROOT, 'tiles', str(self.id))
            os.makedirs(output_dir, exist_ok=True)
            self.tiles_path = os.path.relpath(output_dir, settings.MEDIA_ROOT)
            thumbnail_dir = os.path.join(settings.MEDIA_ROOT, 'thumbnails', str(self.id))
            os.makedirs(thumbnail_dir, exist_ok=True)
            self.thumbnails_dir = os.path.relpath(thumbnail_dir, settings.MEDIA_ROOT)
            super().save(update_fields=['tiles_path', 'thumbnails_dir'])
        else:
            super().save(*args, **kwargs)

        if self.description and (is_new or old_description != self.description):
            generate_embedding_task.delay(self.id, 'upload.GeospatialData')
            
            
        
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

    class Meta:
        indexes = [
            HnswIndex(
                name='geospatial_desc_idx',
                fields=['desc_embedding'],
                m=16,
                ef_construction=64,
                opclasses=['vector_cosine_ops'],
            )
        ]
                

class AnalysispData(models.Model):
     # I need  to come back to set appropriate cascade which does not delete the departmentstaff
    staff = models.ForeignKey(DepartmentStaff,on_delete=models.SET_NULL,null=True,blank=True)
    file = models.FileField(upload_to='analysisuploads/%Y/%m/%d/')
    map_data = models.ForeignKey(MapData,on_delete=models.CASCADE)
    document_data = models.ForeignKey(DocumentData,on_delete=models.CASCADE)
    input_data = models.ForeignKey(GeospatialData, on_delete=models.CASCADE, related_name='input_analysis_data')
    output_data = models.ForeignKey(GeospatialData, on_delete=models.CASCADE, related_name='output_analysis_data')
    description = models.TextField()
    date_captured = models.DateField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)
    desc_embedding = VectorField(dimensions=384, null=True, blank=True)

    def __str__(self):
        return self.file.name
    
    def save(self, *args, **kwargs):
     
        is_new = self.pk is None
        
        # Get original description if existing object
        if not is_new:  
            original = AnalysispData.objects.get(pk=self.pk)
            old_description = original.description
        else:
            old_description = ""
        
      
        # Queue embedding task only if:
        # 1. update_embedding flag is True (not coming from the task itself)
        # 2. There's a description
        # 3. It's a new record OR the description changed
        super().save(*args, **kwargs)

        if self.description and (is_new or old_description != self.description):
           
            logger.debug(f"Triggering embedding generation for AnalysispData ID: {self.pk}")
            generate_embedding_task.delay(self.pk, 'upload.AnalysispData')
           
        
        else:
           
            logger.debug(f"Skipping embedding generation for AnalysispData: {self.pk} (update_embedding=False)")

    async def asave(self, *args, **kwargs):
        await sync_to_async(self.save)(*args, **kwargs)

    class Meta:
        indexes = [
           HnswIndex(
                name='analysisdata_desc_idx',
                fields=['desc_embedding'],
                m=16,
                ef_construction=64,
                opclasses=['vector_cosine_ops'],
            ),
        ]
    
    
    
    



    



    

