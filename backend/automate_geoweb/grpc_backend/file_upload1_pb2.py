# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# NO CHECKED-IN PROTOBUF GENCODE
# source: file_upload1.proto
# Protobuf Python Version: 5.29.0
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import runtime_version as _runtime_version
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
_runtime_version.ValidateProtobufRuntimeVersion(
    _runtime_version.Domain.PUBLIC,
    5,
    29,
    0,
    '',
    'file_upload1.proto'
)
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x12\x66ile_upload1.proto\x12\x06upload\"r\n\x11\x46ileUploadRequest\x12)\n\tmeta_data\x18\x01 \x01(\x0b\x32\x14.upload.FileMetaDataH\x00\x12\x14\n\nchunk_data\x18\x02 \x01(\x0cH\x00\x12\x14\n\nend_signal\x18\x03 \x01(\x08H\x00\x42\x06\n\x04\x64\x61ta\"v\n\x0c\x46ileMetaData\x12\x11\n\tfile_name\x18\x01 \x01(\t\x12\x11\n\tdata_type\x18\x02 \x01(\t\x12\x14\n\x0ctype_of_data\x18\x03 \x01(\t\x12\x13\n\x0b\x64\x65scription\x18\x04 \x01(\t\x12\x15\n\rdate_captured\x18\x05 \x01(\t\"L\n\x12\x46ileUploadResponse\x12\x0f\n\x07success\x18\x01 \x01(\x08\x12\x0f\n\x07message\x18\x02 \x01(\t\x12\x14\n\x0c\x63hunk_number\x18\x03 \x01(\x05\x62\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'file_upload1_pb2', _globals)
if not _descriptor._USE_C_DESCRIPTORS:
  DESCRIPTOR._loaded_options = None
  _globals['_FILEUPLOADREQUEST']._serialized_start=30
  _globals['_FILEUPLOADREQUEST']._serialized_end=144
  _globals['_FILEMETADATA']._serialized_start=146
  _globals['_FILEMETADATA']._serialized_end=264
  _globals['_FILEUPLOADRESPONSE']._serialized_start=266
  _globals['_FILEUPLOADRESPONSE']._serialized_end=342
# @@protoc_insertion_point(module_scope)
