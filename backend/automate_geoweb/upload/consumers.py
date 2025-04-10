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
from .tasks import save_analysis_files,generate_thumbnail
# generate_thumbnail(self,instance, file_instance_id)
logger = logging.getLogger(__name__)



class DocumentUploadConsumer(AsyncWebsocketConsumer):
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
            if not self.close:
                await self.send_response(True, f"Upload completed: {self.metadata.file_name}", self.chunk_number)
            await self.close()

    async def send_response(self, success, message, chunk_number):
        if not self.close:
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
            if not self.close:
                await self.send_response(False, f"Save failed: {str(e)}", self.chunk_number)
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

    # async def save_files(self):
    #     if not self.metadata or not self.temp_files:
    #         logger.warning("No metadata or files to save")
    #         return
    #     try:
    #         upload_dir = os.path.join(settings.MEDIA_ROOT, 'geotiffs', datetime.now().strftime('%Y-%m-%d_%H%M%S'))
    #         os.makedirs(upload_dir, exist_ok=True)

    #         file_paths = {}
    #         for filename, temp_file in self.temp_files.items():
    #             temp_file.close()
    #             with open(temp_file.name, 'rb') as f:
    #                 file_obj = File(f, name=filename)
    #                 dest_path = os.path.join(upload_dir, filename)
    #                 with open(dest_path, 'wb') as dest:
    #                     dest.write(file_obj.read())
    #             file_paths[filename] = dest_path

    #         if not file_paths:
    #             raise ValueError("No files were uploaded successfully")

    #         primary_file = next((f for f in file_paths.keys() if f.lower().endswith('.shp')), list(file_paths.keys())[0])
    #         instance = await GeospatialData.objects.acreate(
    #             file=os.path.relpath(file_paths[primary_file], settings.MEDIA_ROOT),
    #             data_type=self.metadata.data_type,
    #             type_of_data=self.metadata.type_of_data,
    #             description=self.metadata.description,
    #             date_captured=datetime.strptime(self.metadata.date_captured, '%Y-%m-%d').date()
    #         )

            

    #         # from .tasks import generate_tiles_task
    #         # output_dir = os.path.join(settings.MEDIA_ROOT, 'tiles', str(instance.id))
    #         # os.makedirs(output_dir, exist_ok=True)
    #         # generate_tiles_task.delay(file_paths[primary_file], output_dir, instance.id)

    #         tile_path = f"tiles/{instance.id}"
    #         await self.send_response(True, f"Upload completed: {self.metadata.file_name}, tiles at {tile_path}", self.chunk_number)

    #     except Exception as e:
    #         logger.error(f"Save failed: {str(e)}")
    #         if not self.close:
    #             await self.send_response(False, f"Save failed: {str(e)}", self.chunk_number)
    #     finally:
    #         if not self.temp_files_deleted:
    #             for temp_file in self.temp_files.values():
    #                 if os.path.exists(temp_file.name):
    #                     os.unlink(temp_file.name)
    #             if os.path.exists(self.temp_dir):
    #                 os.rmdir(self.temp_dir)
    #             self.temp_files_deleted = True

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



# class AnalysisUploadConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         # Temporary storage for all file types
#         self.temp_files = {
#             'input_geo': {},
#             'output_geo': {},
#             'document': None,
#             'map': None,
#             'analysis': None
#         }
#         self.temp_dir = tempfile.mkdtemp()
#         self.metadata = {}
#         self.chunk_numbers = {
#             'input_geo': 0,
#             'output_geo': 0,
#             'document': 0,
#             'map': 0,
#             'analysis': 0
#         }
#         self.temp_files_deleted = False
#         await self.accept()

#     async def disconnect(self, close_code):
#         # Save files if metadata exists and not already closed
#         if any(self.metadata.values()) and not self.temp_files_deleted:
#             await self.save_files()
        
#         # Clean up temporary files
#         if not self.temp_files_deleted:
#             for file_type, files in self.temp_files.items():
#                 if isinstance(files, dict):  # For geospatial files
#                     for temp_file in files.values():
#                         temp_file.close()
#                         if os.path.exists(temp_file.name):
#                             os.unlink(temp_file.name)
#                 elif files:  # For single files (document, map, analysis)
#                     files.close()
#                     if os.path.exists(files.name):
#                         os.unlink(files.name)
#             if os.path.exists(self.temp_dir):
#                 os.rmdir(self.temp_dir)
#             self.temp_files_deleted = True

#     async def receive(self, text_data=None, bytes_data=None):
#         request = file_upload4_pb2.AnalysisFileUploadRequest()
#         request.ParseFromString(bytes_data)

#         # Handle metadata
#         if request.HasField('meta_data'):
#             meta_field = request.meta_data.WhichOneof('meta_data_oneof')
#             self.metadata[meta_field] = getattr(request.meta_data, meta_field)
#             await self.send_response(True, f"Metadata received for {meta_field}", 0)

#         # Handle input geospatial chunks
#         elif request.HasField('input_geo_chunk_data'):
#             filename = request.input_geo_file_name
#             if not filename:
#                 await self.send_response(False, "Input geo chunk missing file_name", self.chunk_numbers['input_geo'])
#                 return
#             if filename not in self.temp_files['input_geo']:
#                 self.temp_files['input_geo'][filename] = tempfile.NamedTemporaryFile(dir=self.temp_dir, delete=False)
#             self.temp_files['input_geo'][filename].write(request.input_geo_chunk_data)
#             self.chunk_numbers['input_geo'] += 1
#             await self.send_response(True, f"Input geo chunk {self.chunk_numbers['input_geo']} received for {filename}", self.chunk_numbers['input_geo'])

#         # Handle output geospatial chunks
#         elif request.HasField('output_geo_chunk_data'):
#             filename = request.output_geo_file_name
#             if not filename:
#                 await self.send_response(False, "Output geo chunk missing file_name", self.chunk_numbers['output_geo'])
#                 return
#             if filename not in self.temp_files['output_geo']:
#                 self.temp_files['output_geo'][filename] = tempfile.NamedTemporaryFile(dir=self.temp_dir, delete=False)
#             self.temp_files['output_geo'][filename].write(request.output_geo_chunk_data)
#             self.chunk_numbers['output_geo'] += 1
#             await self.send_response(True, f"Output geo chunk {self.chunk_numbers['output_geo']} received for {filename}", self.chunk_numbers['output_geo'])

#         # Handle document chunks
#         elif request.HasField('doc_chunk_data'):
#             if not self.temp_files['document']:
#                 self.temp_files['document'] = tempfile.NamedTemporaryFile(dir=self.temp_dir, delete=False)
#             self.temp_files['document'].write(request.doc_chunk_data)
#             self.chunk_numbers['document'] += 1
#             await self.send_response(True, f"Document chunk {self.chunk_numbers['document']} received", self.chunk_numbers['document'])

#         # Handle map chunks
#         elif request.HasField('map_chunk_data'):
#             if not self.temp_files['map']:
#                 self.temp_files['map'] = tempfile.NamedTemporaryFile(dir=self.temp_dir, delete=False)
#             self.temp_files['map'].write(request.map_chunk_data)
#             self.chunk_numbers['map'] += 1
#             await self.send_response(True, f"Map chunk {self.chunk_numbers['map']} received", self.chunk_numbers['map'])

#         # Handle analysis chunks
#         elif request.HasField('analysis_chunk_data'):
#             if not self.temp_files['analysis']:
#                 self.temp_files['analysis'] = tempfile.NamedTemporaryFile(dir=self.temp_dir, delete=False)
#             self.temp_files['analysis'].write(request.analysis_chunk_data)
#             self.chunk_numbers['analysis'] += 1
#             await self.send_response(True, f"Analysis chunk {self.chunk_numbers['analysis']} received", self.chunk_numbers['analysis'])

#         # Handle end signal
#         elif request.HasField('end_signal'):
#             await self.save_files()
#             await self.send_response(True, "Upload completed", sum(self.chunk_numbers.values()))
#             await self.close()

#     async def send_response(self, success, message, chunk_number):
#         response = file_upload4_pb2.AnalysisFileUploadResponse()
#         response.success = success
#         response.message = message
#         response.chunk_number = chunk_number
#         await self.send(bytes_data=response.SerializeToString())

#     async def save_files(self):
#         if not all(key in self.metadata for key in ['input_file_meta_data', 'output_file_meta_data', 'document_meta_data', 'map_meta_data', 'analysis_asset_meta_data']):
#             logger.warning("Incomplete metadata, cannot save files")
#             await self.send_response(False, "Incomplete metadata received", sum(self.chunk_numbers.values()))
#             return

#         try:
#             # Save Document
#             self.temp_files['document'].close()
#             with open(self.temp_files['document'].name, 'rb') as f:
#                 doc_file = File(f, name=self.metadata['document_meta_data'].file_name)
#                 document_instance = await DocumentData.objects.acreate(
#                     file=doc_file,
#                     description=self.metadata['document_meta_data'].description,
#                     date_captured=datetime.strptime(self.metadata['document_meta_data'].date_captured, '%Y-%m-%d').date()
#                 )

#             # Save Map
#             self.temp_files['map'].close()
#             with open(self.temp_files['map'].name, 'rb') as f:
#                 map_file = File(f, name=self.metadata['map_meta_data'].file_name)
#                 map_instance = await MapData.objects.acreate(
#                     file=map_file,
#                     description=self.metadata['map_meta_data'].description,
#                     date_captured=datetime.strptime(self.metadata['map_meta_data'].date_captured, '%Y-%m-%d').date()
#                 )

#             # Save Input Geospatial
#             input_file_paths = {}
#             for filename, temp_file in self.temp_files['input_geo'].items():
#                 temp_file.close()
#                 with open(temp_file.name, 'rb') as f:
#                     file_obj = File(f, name=filename)
#                     input_file_paths[filename] = os.path.join('geotiffs', datetime.now().strftime('%Y/%m/%d'), filename)
#                     with open(os.path.join(settings.MEDIA_ROOT, input_file_paths[filename]), 'wb') as dest:
#                         dest.write(file_obj.read())
#             input_primary_file = next((f for f in input_file_paths.keys() if f.lower().endswith('.shp')), list(input_file_paths.keys())[0])
#             input_geo_instance = await GeospatialData.objects.acreate(
#                 file=input_file_paths[input_primary_file],
#                 data_type=self.metadata['input_file_meta_data'].data_type,
#                 type_of_data=self.metadata['input_file_meta_data'].type_of_data,
#                 description=self.metadata['input_file_meta_data'].description,
#                 date_captured=datetime.strptime(self.metadata['input_file_meta_data'].date_captured, '%Y-%m-%d').date()
#             )

#             # Save Output Geospatial
#             output_file_paths = {}
#             for filename, temp_file in self.temp_files['output_geo'].items():
#                 temp_file.close()
#                 with open(temp_file.name, 'rb') as f:
#                     file_obj = File(f, name=filename)
#                     output_file_paths[filename] = os.path.join('geotiffs', datetime.now().strftime('%Y/%m/%d'), filename)
#                     with open(os.path.join(settings.MEDIA_ROOT, output_file_paths[filename]), 'wb') as dest:
#                         dest.write(file_obj.read())
#             output_primary_file = next((f for f in output_file_paths.keys() if f.lower().endswith('.shp')), list(output_file_paths.keys())[0])
#             output_geo_instance = await GeospatialData.objects.acreate(
#                 file=output_file_paths[output_primary_file],
#                 data_type=self.metadata['output_file_meta_data'].data_type,
#                 type_of_data=self.metadata['output_file_meta_data'].type_of_data,
#                 description=self.metadata['output_file_meta_data'].description,
#                 date_captured=datetime.strptime(self.metadata['output_file_meta_data'].date_captured, '%Y-%m-%d').date()
#             )

#             # Save Analysis Asset
#             self.temp_files['analysis'].close()
#             with open(self.temp_files['analysis'].name, 'rb') as f:
#                 analysis_file = File(f, name=self.metadata['analysis_asset_meta_data'].file_name)
#                 analysis_instance = await AnalysispData.objects.acreate(
#                     file=analysis_file,
#                     map_data=map_instance,
#                     document_data=document_instance,
#                     input_data=input_geo_instance,
#                     output_data=output_geo_instance,
#                     description=self.metadata['analysis_asset_meta_data'].description,
#                     date_captured=datetime.strptime(self.metadata['analysis_asset_meta_data'].date_captured, '%Y-%m-%d').date()
#                 )

#         except Exception as e:
#             logger.error(f"Save failed: {str(e)}")
#             await self.send_response(False, f"Save failed: {str(e)}", sum(self.chunk_numbers.values()))
#         finally:
#             if not self.temp_files_deleted:
#                 for file_type, files in self.temp_files.items():
#                     if isinstance(files, dict):
#                         for temp_file in files.values():
#                             if os.path.exists(temp_file.name):
#                                 os.unlink(temp_file.name)
#                     elif files and os.path.exists(files.name):
#                         os.unlink(files.name)
#                 if os.path.exists(self.temp_dir):
#                     os.rmdir(self.temp_dir)
#                 self.temp_files_deleted = True


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



# class AnalysisUploadConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.temp_files = {
#             'input_geo': {},
#             'output_geo': {},
#             'document': None,
#             'map': None,
#             'analysis': None
#         }
#         self.temp_dir = tempfile.mkdtemp()
#         self.metadata = {}
#         self.chunk_numbers = {
#             'input_geo': 0,
#             'output_geo': 0,
#             'document': 0,
#             'map': 0,
#             'analysis': 0
#         }
#         self.temp_files_deleted = False
#         await self.accept()

#     async def disconnect(self, close_code):
#         if any(self.metadata.values()) and not self.temp_files_deleted:
#             await self.prepare_for_celery()
#         if not self.temp_files_deleted:
#             await self.clean_temp_files()

#     async def receive(self, text_data=None, bytes_data=None):
#         try:
#             request = file_upload4_pb2.AnalysisFileUploadRequest()
#             request.ParseFromString(bytes_data)

#             data_field = request.WhichOneof('data')
#             if data_field in ['input_meta_data', 'output_meta_data', 'document_meta_data', 'map_meta_data', 'analysis_meta_data']:
#                 # Accumulate all metadata from the request
#                 if request.input_meta_data:
#                     self.metadata['input_meta_data'] = request.input_meta_data
#                 if request.output_meta_data:
#                     self.metadata['output_meta_data'] = request.output_meta_data
#                 if request.document_meta_data:
#                     self.metadata['document_meta_data'] = request.document_meta_data
#                 if request.map_meta_data:
#                     self.metadata['map_meta_data'] = request.map_meta_data
#                 if request.analysis_meta_data:
#                     self.metadata['analysis_meta_data'] = request.analysis_meta_data
#                 await self.send_response(True, f"Metadata received for {', '.join(self.metadata.keys())}", 0)

#             elif request.HasField('input_geo_chunk_data'):
#                 filename = request.input_geo_file_name
#                 if not filename:
#                     await self.send_response(False, "Input geo chunk missing file_name", self.chunk_numbers['input_geo'])
#                     return
#                 if filename not in self.temp_files['input_geo']:
#                     self.temp_files['input_geo'][filename] = tempfile.NamedTemporaryFile(dir=self.temp_dir, delete=False)
#                 self.temp_files['input_geo'][filename].write(request.input_geo_chunk_data)
#                 self.chunk_numbers['input_geo'] += 1
#                 await self.send_response(True, f"Input geo chunk {self.chunk_numbers['input_geo']} received for {filename}", self.chunk_numbers['input_geo'])

#             elif request.HasField('output_geo_chunk_data'):
#                 filename = request.output_geo_file_name
#                 if not filename:
#                     await self.send_response(False, "Output geo chunk missing file_name", self.chunk_numbers['output_geo'])
#                     return
#                 if filename not in self.temp_files['output_geo']:
#                     self.temp_files['output_geo'][filename] = tempfile.NamedTemporaryFile(dir=self.temp_dir, delete=False)
#                 self.temp_files['output_geo'][filename].write(request.output_geo_chunk_data)
#                 self.chunk_numbers['output_geo'] += 1
#                 await self.send_response(True, f"Output geo chunk {self.chunk_numbers['output_geo']} received for {filename}", self.chunk_numbers['output_geo'])

#             elif request.HasField('doc_chunk_data'):
#                 if not self.temp_files['document']:
#                     self.temp_files['document'] = tempfile.NamedTemporaryFile(dir=self.temp_dir, delete=False)
#                 self.temp_files['document'].write(request.doc_chunk_data)
#                 self.chunk_numbers['document'] += 1
#                 await self.send_response(True, f"Document chunk {self.chunk_numbers['document']} received", self.chunk_numbers['document'])

#             elif request.HasField('map_chunk_data'):
#                 if not self.temp_files['map']:
#                     self.temp_files['map'] = tempfile.NamedTemporaryFile(dir=self.temp_dir, delete=False)
#                 self.temp_files['map'].write(request.map_chunk_data)
#                 self.chunk_numbers['map'] += 1
#                 await self.send_response(True, f"Map chunk {self.chunk_numbers['map']} received", self.chunk_numbers['map'])

#             elif request.HasField('analysis_chunk_data'):
#                 if not self.temp_files['analysis']:
#                     self.temp_files['analysis'] = tempfile.NamedTemporaryFile(dir=self.temp_dir, delete=False)
#                 self.temp_files['analysis'].write(request.analysis_chunk_data)
#                 self.chunk_numbers['analysis'] += 1
#                 await self.send_response(True, f"Analysis chunk {self.chunk_numbers['analysis']} received", self.chunk_numbers['analysis'])

#             elif request.HasField('end_signal'):
#                 print("in consumer metadata",self.metadata)
#                 logger.info("in consumer metadata",self.metadata)
#                 task_id = await self.prepare_for_celery()
#                 if task_id:
#                     await self.send_response(True, f"Upload completed. Processing with task ID: {task_id}", sum(self.chunk_numbers.values()))
#                 else:
#                     await self.send_response(False, "Upload failed: Incomplete metadata or chunks", sum(self.chunk_numbers.values()))
#                 await self.close()
#         except Exception as e:
#             logger.error(f"Error in receive: {str(e)}")
#             await self.send_response(False, f"Upload failed: Server error - {str(e)}", sum(self.chunk_numbers.values()))
#             await self.close(code=1011)

#     async def send_response(self, success, message, chunk_number):
#         if getattr(self, '_is_closed', False):
#             logger.warning(f"Cannot send response: WebSocket already closed - {message}")
#             return
#         response = file_upload4_pb2.AnalysisFileUploadResponse()
#         response.success = success
#         response.message = message
#         response.chunk_number = chunk_number
#         serialized_response = response.SerializeToString()
#         logger.debug(f"Sending response: success={success}, message={message}, chunk={chunk_number}, size={len(serialized_response)} bytes")
#         await self.send(bytes_data=serialized_response)

#     async def prepare_for_celery(self):
#         required_keys = ['input_meta_data', 'output_meta_data', 'document_meta_data', 'map_meta_data', 'analysis_meta_data']
#         if not all(key in self.metadata for key in required_keys):
#             logger.warning("Incomplete metadata, cannot save files")
#             return None

#         temp_file_paths = {
#             'input_geo': {},
#             'output_geo': {},
#             'document': None,
#             'map': None,
#             'analysis': None
#         }

#         serialized_metadata = {}
#         for key, value in self.metadata.items():
#             serialized_metadata[key] = {
#                 'file_name': value.file_name,
#                 'description': value.description,
#                 'date_captured': value.date_captured,
#                 'data_type': getattr(value, 'data_type', ''),
#                 'type_of_data': getattr(value, 'type_of_data', '')
#             }

#         for filename, temp_file in self.temp_files['input_geo'].items():
#             temp_file.flush()
#             temp_file_paths['input_geo'][filename] = temp_file.name

#         for filename, temp_file in self.temp_files['output_geo'].items():
#             temp_file.flush()
#             temp_file_paths['output_geo'][filename] = temp_file.name

#         for file_type in ['document', 'map', 'analysis']:
#             if self.temp_files[file_type]:
#                 self.temp_files[file_type].flush()
#                 temp_file_paths[file_type] = self.temp_files[file_type].name

#         task = save_analysis_files.delay(temp_file_paths, serialized_metadata)
#         self.temp_files_deleted = True
#         return task.id

#     async def clean_temp_files(self):
#         for file_type, files in self.temp_files.items():
#             if isinstance(files, dict):
#                 for temp_file in files.values():
#                     temp_file.close()
#                     if os.path.exists(temp_file.name):
#                         os.unlink(temp_file.name)
#             elif files:
#                 files.close()
#                 if os.path.exists(files.name):
#                     os.unlink(files.name)
#         if os.path.exists(self.temp_dir):
#             os.rmdir(self.temp_dir)
#         self.temp_files_deleted = True