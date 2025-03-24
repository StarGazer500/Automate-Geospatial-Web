# import io
# from channels.generic.websocket import AsyncWebsocketConsumer
# from grpc_backend import file_upload1_pb2
# from django.core.files import File
# from .models import GeospatialData
# from datetime import datetime
# import tempfile
# import os

# class FileUploadConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.tif')
#         self.metadata = None
#         self.chunk_number = 0
#         self.temp_file_deleted = False  # Track deletion state
#         await self.accept()

#     async def disconnect(self, close_code):
#         if self.metadata and not self.close:
#             await self.save_file()
#         # Clean up temp file only if it hasn’t been deleted
#         if hasattr(self, 'temp_file') and not self.temp_file_deleted:
#             self.temp_file.close()
#             if os.path.exists(self.temp_file.name):
#                 os.unlink(self.temp_file.name)
#             self.temp_file_deleted = True

#     async def receive(self, text_data=None, bytes_data=None):
#         request = file_upload1_pb2.FileUploadRequest()
#         request.ParseFromString(bytes_data)

#         if request.HasField('meta_data'):
#             self.metadata = request.meta_data
#             await self.send_response(True, f"Metadata received for {self.metadata.file_name}", 0)
#         elif request.HasField('chunk_data'):
#             self.temp_file.write(request.chunk_data)
#             self.chunk_number += 1
#             await self.send_response(True, f"Chunk {self.chunk_number} received", self.chunk_number)
#         elif request.HasField('end_signal'):
#             await self.save_file()
#             if not self.close:
#                 await self.send_response(True, f"Upload completed: {self.metadata.file_name}", self.chunk_number)
#             await self.close()

#     async def send_response(self, success, message, chunk_number):
#         if not self.close:
#             response = file_upload1_pb2.FileUploadResponse()
#             response.success = success
#             response.message = message
#             response.chunk_number = chunk_number
#             await self.send(bytes_data=response.SerializeToString())

#     async def save_file(self):
#         if not self.metadata:
#             return

#         try:
#             self.temp_file.close()
#             file_name = self.metadata.file_name
#             with open(self.temp_file.name, 'rb') as f:
#                 file_obj = File(f, name=file_name)
#                 await GeospatialData.objects.acreate(
#                     file=file_obj,
#                     data_type=self.metadata.data_type,
#                     type_of_data=self.metadata.type_of_data,
#                     description=self.metadata.description,
#                     date_captured=datetime.strptime(self.metadata.date_captured, '%Y-%m-%d').date()
#                 )
#         except Exception as e:
#             if not self.close:
#                 await self.send_response(False, f"Save failed: {str(e)}", self.chunk_number)
#         finally:
#             # Clean up temp file and mark it as deleted
#             if not self.temp_file_deleted and os.path.exists(self.temp_file.name):
#                 os.unlink(self.temp_file.name)
#                 self.temp_file_deleted = True


import io
from channels.generic.websocket import AsyncWebsocketConsumer
from grpc_backend import file_upload2_pb2
from django.core.files import File
from .models import GeospatialData
from datetime import datetime
import tempfile
import os
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

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
            upload_dir = os.path.join(settings.MEDIA_ROOT, 'geotiffs', datetime.now().strftime('%Y-%m-%d_%H%M%S'))
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

            primary_file = next((f for f in file_paths.keys() if f.lower().endswith('.shp')), list(file_paths.keys())[0])
            instance = await GeospatialData.objects.acreate(
                file=os.path.relpath(file_paths[primary_file], settings.MEDIA_ROOT),
                data_type=self.metadata.data_type,
                type_of_data=self.metadata.type_of_data,
                description=self.metadata.description,
                date_captured=datetime.strptime(self.metadata.date_captured, '%Y-%m-%d').date()
            )

            from .tasks import generate_tiles_task
            output_dir = os.path.join(settings.MEDIA_ROOT, 'tiles', str(instance.id))
            os.makedirs(output_dir, exist_ok=True)
            generate_tiles_task.delay(file_paths[primary_file], output_dir, instance.id)

            tile_path = f"tiles/{instance.id}"
            await self.send_response(True, f"Upload completed: {self.metadata.file_name}, tiles at {tile_path}", self.chunk_number)

        except Exception as e:
            logger.error(f"Save failed: {str(e)}")
            if not self.close:
                await self.send_response(False, f"Save failed: {str(e)}", self.chunk_number)
        finally:
            if not self.temp_files_deleted:
                for temp_file in self.temp_files.values():
                    if os.path.exists(temp_file.name):
                        os.unlink(temp_file.name)
                if os.path.exists(self.temp_dir):
                    os.rmdir(self.temp_dir)
                self.temp_files_deleted = True