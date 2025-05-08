# uploads/routing.py
from django.urls import re_path
from . import consumers,edit_upload_consumer


websocket_urlpatterns = [
    re_path(r'ws/upload/$', consumers.FileUploadConsumer.as_asgi()),
    re_path(r'ws/documentupload/$', consumers.DocumentUploadConsumer.as_asgi()),
    re_path(r'ws/mapupload/$', consumers.MapUploadConsumer.as_asgi()),
    re_path(r'ws/analysisupload/$', consumers.AnalysisUploadConsumer.as_asgi()),

    re_path(r'ws/editfile/$', edit_upload_consumer.EditFileConsumer.as_asgi()),
    
    
]