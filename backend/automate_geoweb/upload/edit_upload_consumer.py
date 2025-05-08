import io
from channels.generic.websocket import AsyncWebsocketConsumer
from grpc_backend import file_upload5_pb2
from django.core.files import File
from datetime import datetime
import tempfile
import os
from django.conf import settings
import logging
from .models import DocumentData,MapData,AnalysispData
from .tasks import generate_thumbnail,generate_geo_thumbnail,generate_tiles_task


logger = logging.getLogger(__name__)
from celery import chain

class EditFileConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.temp_files = {}
        self.metadata = None
        self.chunk_number = 0
        self.temp_dir = tempfile.mkdtemp()
        self.temp_files_deleted = False
        await self.accept()

    async def disconnect(self, close_code):
        if self.metadata and not self.temp_files_deleted:
            await self.save_files()
        if not self.temp_files_deleted:
            for temp_file in self.temp_files.values():
                temp_file.close()
                if os.path.exists(temp_file.name):
                    os.unlink(temp_file.name)
            if os.path.exists(self.temp_dir):
                os.rmdir(self.temp_dir)
            self.temp_files_deleted = True

    async def receive(self, text_data=None, bytes_data=None):
        logger.debug(f"Raw bytes received: {bytes_data.hex() if bytes_data else 'None'}")
        request = file_upload5_pb2.FileUploadRequest1()
        request.ParseFromString(bytes_data)

        if request.HasField('meta_data'):
            self.metadata = request.meta_data
            logger.info(f"Metadata received: {self.metadata.file_name}")
            await self.send_response(True, f"Metadata received for {self.metadata.file_name}", 0)
        elif request.HasField('chunk_data'):
            filename = request.file_name  # Use top-level file_name
            if not filename:
                logger.error("No file_name provided in chunk request")
                await self.send_response(False, "Chunk missing file_name", self.chunk_number)
                return
            if filename not in self.temp_files:
                self.temp_files[filename] = tempfile.NamedTemporaryFile(dir=self.temp_dir, delete=False)
            self.temp_files[filename].write(request.chunk_data)
            self.chunk_number += 1
            logger.info(f"Chunk {self.chunk_number} received for {filename}, size: {len(request.chunk_data)} bytes")
            await self.send_response(True, f"Chunk {self.chunk_number} received for {filename}", self.chunk_number)
        elif request.HasField('end_signal'):
            logger.info("End signal received")
            await self.save_files()
            await self.send_response(True, f"Upload completed: {self.metadata.file_name}", self.chunk_number)
            await self.close()

    async def send_response(self, success, message, chunk_number):
        response = file_upload5_pb2.FileUploadResponse1()
        response.success = success
        response.message = message
        response.chunk_number = chunk_number
        await self.send(bytes_data=response.SerializeToString())


    async def save_files(self):
        if not self.metadata or not self.temp_files:
            logger.warning("No metadata or files to save")
            return
        try:
            # First, create the instance without the final file path (we'll update it later)
            if self.metadata.data_category=="geospatial":
                upload_dir = os.path.join(settings.MEDIA_ROOT, 'geospatial', str(self.metadata.file_id))
                thumbnail_dir = os.path.join(settings.MEDIA_ROOT, 'thumbnails', str(self.metadata.file_id))
                file_paths = {}
                for filename, temp_file in self.temp_files.items():

                    
                    with open(temp_file.name, 'rb') as f:
                        file_obj = File(f, name=filename)
                        dest_path = os.path.join(upload_dir, filename)
                        with open(dest_path, 'wb') as dest:
                            dest.write(file_obj.read())
                        file_paths[filename] = dest_path
                if not file_paths:
                    raise ValueError("No files were uploaded successfully")
                await self.send_response(True, f"Upload completed: {self.metadata.file_name},", self.chunk_number)
                
                output_dir = os.path.join(settings.MEDIA_ROOT, 'tiles', str(self.metadata.file_id))
                # files = [str(f) for f in directory.iterdir() if f.is_file()]
                print("file",file_paths.values())
                for file in file_paths.values():
                   
                    filename = os.path.basename(file)
                    file_ext = os.path.splitext(filename)[1].lower()
                    if file_ext in ['.dbf', '.prj', '.shx', '.cpg']:
                        continue
                    logger.info(f"Queuing chain from save for file: {file}, id: {self.metadata.file_id}")
                    chain(
                        generate_tiles_task.s(file, output_dir, self.metadata.file_id),
                        generate_geo_thumbnail.s('upload.GeospatialData', self.metadata.file_id, None, thumbnail_dir)
                    ).delay()
                    logger.info("file overwriiten")

            elif self.metadata.data_category=="document":
                file_name = self.metadata.file_name
                print("details",file_name,self.metadata.file_id)
                instance = await DocumentData.objects.aget(id=self.metadata.file_id)
                print("instance",instance)

                if instance.file and file_name:
                    file_obj = None
                    for filename, temp_file in self.temp_files.items():
                        
                        with open(temp_file.name, 'rb') as f:
                            file_obj = File(f, name=filename)
                            instance.file=file_obj
                            await instance.asave(update_fields=['file']) 
                            # with open(dest_path, 'wb') as dest:
                                # dest.write(file_obj.read())
                            # file_paths[filename] = dest_path
                 
                    
                    logger.info("file overwriiten")
                    generate_thumbnail.delay("upload.DocumentData", self.metadata.file_id) 


            elif self.metadata.data_category=="map":
                file_name = self.metadata.file_name
                instance = await MapData.objects.aget(id=self.metadata.file_id)
                if instance.file and file_name:
                    file_obj = None
                    for filename, temp_file in self.temp_files.items():
                        
                        with open(temp_file.name, 'rb') as f:
                            file_obj = File(f, name=filename)
                            instance.file=file_obj
                            await instance.asave(update_fields=['file']) 
                            # dest_path = os.path.join(upload_dir, filename)
                            # with open(dest_path, 'wb') as dest:
                            #     dest.write(file_obj.read())
                            # file_paths[filename] = dest_path
                    
                   
                    logger.info("file overwriiten")
                    generate_thumbnail.delay("upload.MapData", self.metadata.file_id) 

            elif self.metadata.data_category=="analysis":
                file_name = self.metadata.file_name
                instance = await AnalysispData.objects.aget(id=self.metadata.file_id)
                if instance.file and file_name:
                    file_obj = None
                    for filename, temp_file in self.temp_files.items():
                  
                        with open(temp_file.name, 'rb') as f:
                            file_obj = File(f, name=filename)
                            instance.file=file_obj
                            await instance.asave(update_fields=['file']) 
                            
                            # dest_path = os.path.join(upload_dir, filename)
                            # with open(dest_path, 'wb') as dest:
                            #     dest.write(file_obj.read())
                            # file_paths[filename] = dest_path
                    if not file_obj:
                        raise ValueError("No files were uploaded successfully")
                    
                    
                    logger.info("file overwriiten")
                    generate_thumbnail.delay("upload.AnalysispData", self.metadata.file_id) 


            
            

        except Exception as e:
            logger.error(f"Save failed: {str(e)}")
            
            await self.send_response(False, f"Save failed: {str(e)}", self.chunk_number)
            # Optionally delete the instance if it was created but saving files failed
            if 'instance' in locals():
                await instance.adelete()
        finally:
            if not self.temp_files_deleted:
                for temp_file in self.temp_files.values():
                    if os.path.exists(temp_file.name):
                        os.unlink(temp_file.name)
                if os.path.exists(self.temp_dir):
                    os.rmdir(self.temp_dir)
                self.temp_files_deleted = True