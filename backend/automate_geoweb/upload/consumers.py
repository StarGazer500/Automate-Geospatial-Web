import io
from channels.generic.websocket import AsyncWebsocketConsumer
from grpc_backend import file_upload1_pb2,file_upload2_pb2,file_upload3_pb2,file_upload4_pb2
from django.core.files import File
from datetime import datetime
import tempfile
import os
from django.conf import settings
import logging
from .models import GeospatialData, DocumentData,MapData,AnalysispData
from .tasks import save_analysis_files,generate_thumbnail,generate_geo_thumbnail,generate_tiles_task
from .consumer_utils import consumer_authenticate
# generate_thumbnail(self,instance, file_instance_id)
logger = logging.getLogger(__name__)
from celery import chain



class DocumentUploadConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # session = self.scope["session"]
        # is_authenticated = await consumer_authenticate(session)
        # print(is_authenticated)
        # if not is_authenticated:
        #     self.send("You are Loggeded Out")
        #     # await self.close()
            
        self.temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.tif')
        self.metadata = None
        self.chunk_number = 0
        self.temp_file_deleted = False  # Track deletion state
        await self.accept()

    async def disconnect(self, close_code):
        if self.metadata and not self.temp_file_deleted :
            await self.save_file()
        # Clean up temp file only if it hasn’t been deleted
        if hasattr(self, 'temp_file') and not self.temp_file_deleted:
            self.temp_file.close()
            if os.path.exists(self.temp_file.name):
                os.unlink(self.temp_file.name)
            self.temp_file_deleted = True

    async def receive(self, text_data=None, bytes_data=None):
        request = file_upload1_pb2.DocumentUploadRequest()
        request.ParseFromString(bytes_data)

        if request.HasField('meta_data'):
            self.metadata = request.meta_data
            await self.send_response(True, f"Metadata received for {self.metadata.file_name}", 0)
        elif request.HasField('chunk_data'):
            self.temp_file.write(request.chunk_data)
            self.chunk_number += 1
            await self.send_response(True, f"Chunk {self.chunk_number} received", self.chunk_number)
        elif request.HasField('end_signal'):
            print("meta data",self.metadata)
            await self.save_file()

            await self.send_response(True, f"Upload completed: {self.metadata.file_name}", self.chunk_number)
            await self.close()

    async def send_response(self, success, message, chunk_number):
       
        response = file_upload1_pb2. DocumentUploadResponse()
        response.success = success
        response.message = message
        response.chunk_number = chunk_number
        await self.send(bytes_data=response.SerializeToString())

    async def save_file(self):
        if not self.metadata:
            return

        try:
            
            self.temp_file.close()
            file_name = self.metadata.file_name
            with open(self.temp_file.name, 'rb') as f:
                file_obj = File(f, name=file_name)
                document = await  DocumentData.objects.acreate(
                    file=file_obj,
                    description=self.metadata.description,
                    date_captured=datetime.strptime(self.metadata.date_captured, '%Y-%m-%d').date()
                )
            
            generate_thumbnail.delay("upload.DocumentData", document.id)
            
           
        except Exception as e:
            logger.error(f"Save failed: {str(e)}")
            if not self.close:
                await self.send_response(False, f"Save failed: {str(e)}", self.chunk_number)
            # Optionally delete the instance if it was created but saving files failed
            if 'instance' in locals():
                await document.adelete()
        finally:
            # Clean up temp file and mark it as deleted
            if not self.temp_file_deleted and os.path.exists(self.temp_file.name):
                os.unlink(self.temp_file.name)
                self.temp_file_deleted = True



class MapUploadConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.tif')
        self.metadata = None
        self.chunk_number = 0
        self.temp_file_deleted = False  # Track deletion state
        await self.accept()

    async def disconnect(self, close_code):
        if self.metadata and not self.close:
            await self.save_file()
        # Clean up temp file only if it hasn’t been deleted
        if hasattr(self, 'temp_file') and not self.temp_file_deleted:
            self.temp_file.close()
            if os.path.exists(self.temp_file.name):
                os.unlink(self.temp_file.name)
            self.temp_file_deleted = True

    async def receive(self, text_data=None, bytes_data=None):
        request = file_upload3_pb2.MapUploadRequest()
        request.ParseFromString(bytes_data)

        if request.HasField('meta_data'):
            self.metadata = request.meta_data
            await self.send_response(True, f"Metadata received for {self.metadata.file_name}", 0)
        elif request.HasField('chunk_data'):
            self.temp_file.write(request.chunk_data)
            self.chunk_number += 1
            await self.send_response(True, f"Chunk {self.chunk_number} received", self.chunk_number)
        elif request.HasField('end_signal'):
            await self.save_file()
            if not self.close:
                await self.send_response(True, f"Upload completed: {self.metadata.file_name}", self.chunk_number)
            await self.close()

    async def send_response(self, success, message, chunk_number):
        if not self.close:
            response = file_upload3_pb2. MapUploadResponse()
            response.success = success
            response.message = message
            response.chunk_number = chunk_number
            await self.send(bytes_data=response.SerializeToString())

    async def save_file(self):
        if not self.metadata:
            return

        try:
            self.temp_file.close()
            file_name = self.metadata.file_name
            with open(self.temp_file.name, 'rb') as f:
                file_obj = File(f, name=file_name)
                map = await  MapData.objects.acreate(
                    file=file_obj,
                    description=self.metadata.description,
                    date_captured=datetime.strptime(self.metadata.date_captured, '%Y-%m-%d').date()
                )
            generate_thumbnail.delay("upload.MapData", map.id)
        except Exception as e:
            if not self.close:
                await self.send_response(False, f"Save failed: {str(e)}", self.chunk_number)
        finally:
            # Clean up temp file and mark it as deleted
            if not self.temp_file_deleted and os.path.exists(self.temp_file.name):
                os.unlink(self.temp_file.name)
                self.temp_file_deleted = True





class FileUploadConsumer(AsyncWebsocketConsumer):
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
        request = file_upload2_pb2.FileUploadRequest()
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
        response = file_upload2_pb2.FileUploadResponse()
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
            instance = await GeospatialData.objects.acreate(
                files_dir='',  # Temporarily empty; we'll update this after determining the path
                data_type=self.metadata.data_type,
                type_of_data=self.metadata.type_of_data,
                description=self.metadata.description,
                date_captured=datetime.strptime(self.metadata.date_captured, '%Y-%m-%d').date()
            )

            # Now create the directory using the instance ID
            upload_dir = os.path.join(settings.MEDIA_ROOT, 'geospatial', str(instance.id))
            os.makedirs(upload_dir, exist_ok=True)

            file_paths = {}
            for filename, temp_file in self.temp_files.items():
                temp_file.close()
                with open(temp_file.name, 'rb') as f:
                    file_obj = File(f, name=filename)
                    dest_path = os.path.join(upload_dir, filename)
                    with open(dest_path, 'wb') as dest:
                        dest.write(file_obj.read())
                    file_paths[filename] = dest_path

            if not file_paths:
                raise ValueError("No files were uploaded successfully")

            # Determine the primary file (e.g., .shp file or the first file)
            # primary_file = next((f for f in file_paths.keys() if f.lower().endswith('.shp')), list(file_paths.keys())[0])
            
            # Update the instance with the relative path to the primary file
            relative_path = os.path.relpath(upload_dir, settings.MEDIA_ROOT)
            instance.files_dir = relative_path
                        
            # Explicitly specify that we want to update the files_dir field
            await instance.asave(update_fields=['files_dir'])

            # Optional: Generate tiles or other tasks
            
            await self.send_response(True, f"Upload completed: {self.metadata.file_name},", self.chunk_number)

        except Exception as e:
            logger.error(f"Save failed: {str(e)}")
            if not self.close:
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






class AnalysisUploadConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        
        # Temporary storage for all file types
        self.temp_files = {
            'input_geo': {},
            'output_geo': {},
            'document': None,
            'map': None,
            'analysis': None
        }
        self.temp_dir = tempfile.mkdtemp()
        self.metadata = {}
        self.chunk_numbers = {
            'input_geo': 0,
            'output_geo': 0,
            'document': 0,
            'map': 0,
            'analysis': 0
        }
        self.temp_files_deleted = False
        await self.accept()

    async def disconnect(self, close_code):
        # Save files if metadata exists and not already closed
        if any(self.metadata.values()) and not self.temp_files_deleted:
            await self.prepare_for_celery()
        
        # Clean up temporary files
        if not self.temp_files_deleted:
            await self.clean_temp_files()

    async def receive(self, text_data=None, bytes_data=None):
        request = file_upload4_pb2.AnalysisFileUploadRequest()
        request.ParseFromString(bytes_data)

        # Handle metadata
        data_field = request.WhichOneof('data')
        if data_field in ['input_meta_data', 'output_meta_data', 'document_meta_data', 
                         'map_meta_data', 'analysis_meta_data']:
            self.metadata[data_field] = getattr(request, data_field)
            await self.send_response(True, f"Metadata received for {data_field}", 0)

        # Handle input geospatial chunks
        elif request.HasField('input_geo_chunk_data'):
            filename = request.input_geo_file_name
            if not filename:
                await self.send_response(False, "Input geo chunk missing file_name", 
                                       self.chunk_numbers['input_geo'])
                return
            if filename not in self.temp_files['input_geo']:
                self.temp_files['input_geo'][filename] = tempfile.NamedTemporaryFile(
                    dir=self.temp_dir, delete=False)
            self.temp_files['input_geo'][filename].write(request.input_geo_chunk_data)
            self.chunk_numbers['input_geo'] += 1
            await self.send_response(True, 
                                   f"Input geo chunk {self.chunk_numbers['input_geo']} received for {filename}", 
                                   self.chunk_numbers['input_geo'])

        # Handle output geospatial chunks
        elif request.HasField('output_geo_chunk_data'):
            filename = request.output_geo_file_name
            if not filename:
                await self.send_response(False, "Output geo chunk missing file_name", 
                                       self.chunk_numbers['output_geo'])
                return
            if filename not in self.temp_files['output_geo']:
                self.temp_files['output_geo'][filename] = tempfile.NamedTemporaryFile(
                    dir=self.temp_dir, delete=False)
            self.temp_files['output_geo'][filename].write(request.output_geo_chunk_data)
            self.chunk_numbers['output_geo'] += 1
            await self.send_response(True, 
                                   f"Output geo chunk {self.chunk_numbers['output_geo']} received for {filename}", 
                                   self.chunk_numbers['output_geo'])

        # Handle document chunks
        elif request.HasField('doc_chunk_data'):
            if not self.temp_files['document']:
                self.temp_files['document'] = tempfile.NamedTemporaryFile(
                    dir=self.temp_dir, delete=False)
            self.temp_files['document'].write(request.doc_chunk_data)
            self.chunk_numbers['document'] += 1
            await self.send_response(True, 
                                   f"Document chunk {self.chunk_numbers['document']} received", 
                                   self.chunk_numbers['document'])

        # Handle map chunks
        elif request.HasField('map_chunk_data'):
            if not self.temp_files['map']:
                self.temp_files['map'] = tempfile.NamedTemporaryFile(
                    dir=self.temp_dir, delete=False)
            self.temp_files['map'].write(request.map_chunk_data)
            self.chunk_numbers['map'] += 1
            await self.send_response(True, 
                                   f"Map chunk {self.chunk_numbers['map']} received", 
                                   self.chunk_numbers['map'])

        # Handle analysis chunks
        elif request.HasField('analysis_chunk_data'):
            if not self.temp_files['analysis']:
                self.temp_files['analysis'] = tempfile.NamedTemporaryFile(
                    dir=self.temp_dir, delete=False)
            self.temp_files['analysis'].write(request.analysis_chunk_data)
            self.chunk_numbers['analysis'] += 1
            await self.send_response(True, 
                                   f"Analysis chunk {self.chunk_numbers['analysis']} received", 
                                   self.chunk_numbers['analysis'])

        # Handle end signal
        elif request.HasField('end_signal'):
            print("received meta data",self.metadata)
            if not all(key in self.metadata for key in ['input_meta_data', 'output_meta_data', 
                                                       'document_meta_data', 'map_meta_data', 
                                                       'analysis_meta_data']):
                await self.send_response(False, "Missing required metadata", 
                                       sum(self.chunk_numbers.values()))
                await self.close(code=1011)
                return
                
            task_id = await self.prepare_for_celery()
            if task_id:
                await self.send_response(True, 
                                       f"Upload completed. Processing with task ID: {task_id}", 
                                       sum(self.chunk_numbers.values()))
                await self.close()
            else:
                await self.send_response(False, "Failed to process upload", 
                                       sum(self.chunk_numbers.values()))
                await self.close(code=1011)

    async def send_response(self, success, message, chunk_number):
        response = file_upload4_pb2.AnalysisFileUploadResponse()
        response.success = success
        response.message = message
        response.chunk_number = chunk_number
        await self.send(bytes_data=response.SerializeToString())

    async def prepare_for_celery(self):
        """Prepare files for celery processing and start the task"""
        if not all(key in self.metadata for key in ['input_meta_data', 'output_meta_data', 
                                                  'document_meta_data', 'map_meta_data', 
                                                  'analysis_meta_data']):
            logger.warning("Incomplete metadata, cannot save files")
            return None

        # Close all file handlers
        temp_file_paths = {
            'input_geo': {},
            'output_geo': {},
            'document': None,
            'map': None,
            'analysis': None
        }

        # Prepare serializable metadata
        serialized_metadata = {}
        for key, value in self.metadata.items():
            serialized_metadata[key] = {
                'file_name': value.file_name,
                'description': value.description,
                'date_captured': value.date_captured,
                'data_type': getattr(value, 'data_type', ''),
                'type_of_data': getattr(value, 'type_of_data', '')
            }

        # Close temporary files and get their paths
        for filename, temp_file in self.temp_files['input_geo'].items():
            temp_file.flush()
            temp_file.close()
            temp_file_paths['input_geo'][filename] = temp_file.name

        for filename, temp_file in self.temp_files['output_geo'].items():
            temp_file.flush()
            temp_file.close()
            temp_file_paths['output_geo'][filename] = temp_file.name

        for file_type in ['document', 'map', 'analysis']:
            if self.temp_files[file_type]:
                self.temp_files[file_type].flush()
                self.temp_files[file_type].close()
                temp_file_paths[file_type] = self.temp_files[file_type].name

        # Launch celery task
        task = save_analysis_files.delay(temp_file_paths, serialized_metadata)
        

        self.temp_files_deleted = True
        
        return task.id

    async def clean_temp_files(self):
        """Clean up temporary files after they've been processed"""
        for file_type, files in self.temp_files.items():
            if isinstance(files, dict):
                for temp_file in files.values():
                    if not temp_file.closed:
                        temp_file.close()
                    if os.path.exists(temp_file.name):
                        os.unlink(temp_file.name)
            elif files:
                if not files.closed:
                    files.close()
                if os.path.exists(files.name):
                    os.unlink(files.name)
        if os.path.exists(self.temp_dir):
            os.rmdir(self.temp_dir)
        self.temp_files_deleted = True



