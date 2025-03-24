# import grpc
# from concurrent import futures
# import os
# from django.core.management.base import BaseCommand
# from django.conf import settings
# from upload.models import UploadedFile
# import grpc_backend.file_upload_pb2_grpc as file_upload_pb2_grpc
# import grpc_backend.file_upload_pb2 as file_upload_pb2

# from django.core.files.base import ContentFile

# class FileUploadServicer(file_upload_pb2_grpc.FileUploadServiceServicer):
#     def UploadFile(self, request_iterator, context):
#         file_data = b""
#         metadata = None
        
#         for request in request_iterator:
#             if request.HasField("meta_data"):
#                 metadata = request.meta_data
#             elif request.HasField("chunk_data"):
#                 file_data += request.chunk_data

#         if metadata and file_data:
#             # Create the UploadedFile instance
#             uploaded_file = UploadedFile(
#                 file_name=metadata.file_name,
#                 data_type=metadata.data_type,
#                 type_of_data=metadata.type_of_data,
#                 description=metadata.description,
#                 date_captured=metadata.date_captured,
#             )
            
#             # Save the file using FileField
#             uploaded_file.file.save(metadata.file_name, ContentFile(file_data))
#             uploaded_file.save()  # Save the model instance to the database
            
#             return file_upload_pb2.FileUploadResponse(
#                 success=True,
#                 message=f"File {metadata.file_name} uploaded successfully"
#             )
#         else:
#             return file_upload_pb2.FileUploadResponse(
#                 success=False,
#                 message="Upload failed: incomplete data"
#             )

# class Command(BaseCommand):
#     help = 'Runs the gRPC file upload server'

#     def handle(self, *args, **options):
#         server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
#         file_upload_pb2_grpc.add_FileUploadServiceServicer_to_server(FileUploadServicer(), server)
#         server.add_insecure_port('0.0.0.0:50051')
#         server.start()
#         self.stdout.write(self.style.SUCCESS('gRPC server started on port 50051'))
#         server.wait_for_termination()