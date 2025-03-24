import * as jspb from "google-protobuf";
var goog = jspb;
var global = typeof globalThis !== "undefined" && globalThis || typeof window !== "undefined" && window || typeof global !== "undefined" && global || typeof self !== "undefined" && self || function() {
  return this;
}.call(null) || Function("return this")();
goog.exportSymbol("proto.upload.FileMetaData", null, global);
goog.exportSymbol("proto.upload.FileUploadRequest", null, global);
goog.exportSymbol("proto.upload.FileUploadRequest.DataCase", null, global);
goog.exportSymbol("proto.upload.FileUploadResponse", null, global);
proto.upload.FileUploadRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.upload.FileUploadRequest.oneofGroups_);
};
goog.inherits(proto.upload.FileUploadRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.upload.FileUploadRequest.displayName = "proto.upload.FileUploadRequest";
}
proto.upload.FileMetaData = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.upload.FileMetaData, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.upload.FileMetaData.displayName = "proto.upload.FileMetaData";
}
proto.upload.FileUploadResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.upload.FileUploadResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.upload.FileUploadResponse.displayName = "proto.upload.FileUploadResponse";
}
proto.upload.FileUploadRequest.oneofGroups_ = [[1, 2, 3]];
proto.upload.FileUploadRequest.DataCase = {
  DATA_NOT_SET: 0,
  META_DATA: 1,
  CHUNK_DATA: 2,
  END_SIGNAL: 3
};
proto.upload.FileUploadRequest.prototype.getDataCase = function() {
  return (
    /** @type {proto.upload.FileUploadRequest.DataCase} */
    jspb.Message.computeOneofCase(this, proto.upload.FileUploadRequest.oneofGroups_[0])
  );
};
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.upload.FileUploadRequest.prototype.toObject = function(opt_includeInstance) {
    return proto.upload.FileUploadRequest.toObject(opt_includeInstance, this);
  };
  proto.upload.FileUploadRequest.toObject = function(includeInstance, msg) {
    var f, obj = {
      fileName: jspb.Message.getFieldWithDefault(msg, 4, ""),
      metaData: (f = msg.getMetaData()) && proto.upload.FileMetaData.toObject(includeInstance, f),
      chunkData: msg.getChunkData_asB64(),
      endSignal: (f = jspb.Message.getBooleanField(msg, 3)) == null ? void 0 : f
    };
    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }
    return obj;
  };
}
proto.upload.FileUploadRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.FileUploadRequest();
  return proto.upload.FileUploadRequest.deserializeBinaryFromReader(msg, reader);
};
proto.upload.FileUploadRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
      case 4:
        var value = (
          /** @type {string} */
          reader.readString()
        );
        msg.setFileName(value);
        break;
      case 1:
        var value = new proto.upload.FileMetaData();
        reader.readMessage(value, proto.upload.FileMetaData.deserializeBinaryFromReader);
        msg.setMetaData(value);
        break;
      case 2:
        var value = (
          /** @type {!Uint8Array} */
          reader.readBytes()
        );
        msg.setChunkData(value);
        break;
      case 3:
        var value = (
          /** @type {boolean} */
          reader.readBool()
        );
        msg.setEndSignal(value);
        break;
      default:
        reader.skipField();
        break;
    }
  }
  return msg;
};
proto.upload.FileUploadRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.FileUploadRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
proto.upload.FileUploadRequest.serializeBinaryToWriter = function(message, writer) {
  var f = void 0;
  f = message.getFileName();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getMetaData();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.upload.FileMetaData.serializeBinaryToWriter
    );
  }
  f = /** @type {!(string|Uint8Array)} */
  jspb.Message.getField(message, 2);
  if (f != null) {
    writer.writeBytes(
      2,
      f
    );
  }
  f = /** @type {boolean} */
  jspb.Message.getField(message, 3);
  if (f != null) {
    writer.writeBool(
      3,
      f
    );
  }
};
proto.upload.FileUploadRequest.prototype.getFileName = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 4, "")
  );
};
proto.upload.FileUploadRequest.prototype.setFileName = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};
proto.upload.FileUploadRequest.prototype.getMetaData = function() {
  return (
    /** @type{?proto.upload.FileMetaData} */
    jspb.Message.getWrapperField(this, proto.upload.FileMetaData, 1)
  );
};
proto.upload.FileUploadRequest.prototype.setMetaData = function(value) {
  return jspb.Message.setOneofWrapperField(this, 1, proto.upload.FileUploadRequest.oneofGroups_[0], value);
};
proto.upload.FileUploadRequest.prototype.clearMetaData = function() {
  return this.setMetaData(void 0);
};
proto.upload.FileUploadRequest.prototype.hasMetaData = function() {
  return jspb.Message.getField(this, 1) != null;
};
proto.upload.FileUploadRequest.prototype.getChunkData = function() {
  return (
    /** @type {!(string|Uint8Array)} */
    jspb.Message.getFieldWithDefault(this, 2, "")
  );
};
proto.upload.FileUploadRequest.prototype.getChunkData_asB64 = function() {
  return (
    /** @type {string} */
    jspb.Message.bytesAsB64(
      this.getChunkData()
    )
  );
};
proto.upload.FileUploadRequest.prototype.getChunkData_asU8 = function() {
  return (
    /** @type {!Uint8Array} */
    jspb.Message.bytesAsU8(
      this.getChunkData()
    )
  );
};
proto.upload.FileUploadRequest.prototype.setChunkData = function(value) {
  return jspb.Message.setOneofField(this, 2, proto.upload.FileUploadRequest.oneofGroups_[0], value);
};
proto.upload.FileUploadRequest.prototype.clearChunkData = function() {
  return jspb.Message.setOneofField(this, 2, proto.upload.FileUploadRequest.oneofGroups_[0], void 0);
};
proto.upload.FileUploadRequest.prototype.hasChunkData = function() {
  return jspb.Message.getField(this, 2) != null;
};
proto.upload.FileUploadRequest.prototype.getEndSignal = function() {
  return (
    /** @type {boolean} */
    jspb.Message.getBooleanFieldWithDefault(this, 3, false)
  );
};
proto.upload.FileUploadRequest.prototype.setEndSignal = function(value) {
  return jspb.Message.setOneofField(this, 3, proto.upload.FileUploadRequest.oneofGroups_[0], value);
};
proto.upload.FileUploadRequest.prototype.clearEndSignal = function() {
  return jspb.Message.setOneofField(this, 3, proto.upload.FileUploadRequest.oneofGroups_[0], void 0);
};
proto.upload.FileUploadRequest.prototype.hasEndSignal = function() {
  return jspb.Message.getField(this, 3) != null;
};
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.upload.FileMetaData.prototype.toObject = function(opt_includeInstance) {
    return proto.upload.FileMetaData.toObject(opt_includeInstance, this);
  };
  proto.upload.FileMetaData.toObject = function(includeInstance, msg) {
    var f, obj = {
      fileName: jspb.Message.getFieldWithDefault(msg, 1, ""),
      dataType: jspb.Message.getFieldWithDefault(msg, 2, ""),
      typeOfData: jspb.Message.getFieldWithDefault(msg, 3, ""),
      description: jspb.Message.getFieldWithDefault(msg, 4, ""),
      dateCaptured: jspb.Message.getFieldWithDefault(msg, 5, "")
    };
    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }
    return obj;
  };
}
proto.upload.FileMetaData.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.FileMetaData();
  return proto.upload.FileMetaData.deserializeBinaryFromReader(msg, reader);
};
proto.upload.FileMetaData.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
      case 1:
        var value = (
          /** @type {string} */
          reader.readString()
        );
        msg.setFileName(value);
        break;
      case 2:
        var value = (
          /** @type {string} */
          reader.readString()
        );
        msg.setDataType(value);
        break;
      case 3:
        var value = (
          /** @type {string} */
          reader.readString()
        );
        msg.setTypeOfData(value);
        break;
      case 4:
        var value = (
          /** @type {string} */
          reader.readString()
        );
        msg.setDescription(value);
        break;
      case 5:
        var value = (
          /** @type {string} */
          reader.readString()
        );
        msg.setDateCaptured(value);
        break;
      default:
        reader.skipField();
        break;
    }
  }
  return msg;
};
proto.upload.FileMetaData.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.FileMetaData.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
proto.upload.FileMetaData.serializeBinaryToWriter = function(message, writer) {
  var f = void 0;
  f = message.getFileName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getDataType();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getTypeOfData();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getDescription();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getDateCaptured();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
};
proto.upload.FileMetaData.prototype.getFileName = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 1, "")
  );
};
proto.upload.FileMetaData.prototype.setFileName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};
proto.upload.FileMetaData.prototype.getDataType = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 2, "")
  );
};
proto.upload.FileMetaData.prototype.setDataType = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};
proto.upload.FileMetaData.prototype.getTypeOfData = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 3, "")
  );
};
proto.upload.FileMetaData.prototype.setTypeOfData = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};
proto.upload.FileMetaData.prototype.getDescription = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 4, "")
  );
};
proto.upload.FileMetaData.prototype.setDescription = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};
proto.upload.FileMetaData.prototype.getDateCaptured = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 5, "")
  );
};
proto.upload.FileMetaData.prototype.setDateCaptured = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.upload.FileUploadResponse.prototype.toObject = function(opt_includeInstance) {
    return proto.upload.FileUploadResponse.toObject(opt_includeInstance, this);
  };
  proto.upload.FileUploadResponse.toObject = function(includeInstance, msg) {
    var f, obj = {
      success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
      message: jspb.Message.getFieldWithDefault(msg, 2, ""),
      chunkNumber: jspb.Message.getFieldWithDefault(msg, 3, 0)
    };
    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }
    return obj;
  };
}
proto.upload.FileUploadResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.FileUploadResponse();
  return proto.upload.FileUploadResponse.deserializeBinaryFromReader(msg, reader);
};
proto.upload.FileUploadResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
      case 1:
        var value = (
          /** @type {boolean} */
          reader.readBool()
        );
        msg.setSuccess(value);
        break;
      case 2:
        var value = (
          /** @type {string} */
          reader.readString()
        );
        msg.setMessage(value);
        break;
      case 3:
        var value = (
          /** @type {number} */
          reader.readInt32()
        );
        msg.setChunkNumber(value);
        break;
      default:
        reader.skipField();
        break;
    }
  }
  return msg;
};
proto.upload.FileUploadResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.FileUploadResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
proto.upload.FileUploadResponse.serializeBinaryToWriter = function(message, writer) {
  var f = void 0;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getMessage();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getChunkNumber();
  if (f !== 0) {
    writer.writeInt32(
      3,
      f
    );
  }
};
proto.upload.FileUploadResponse.prototype.getSuccess = function() {
  return (
    /** @type {boolean} */
    jspb.Message.getBooleanFieldWithDefault(this, 1, false)
  );
};
proto.upload.FileUploadResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};
proto.upload.FileUploadResponse.prototype.getMessage = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 2, "")
  );
};
proto.upload.FileUploadResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};
proto.upload.FileUploadResponse.prototype.getChunkNumber = function() {
  return (
    /** @type {number} */
    jspb.Message.getFieldWithDefault(this, 3, 0)
  );
};
proto.upload.FileUploadResponse.prototype.setChunkNumber = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};
export const { FileUploadRequest, FileMetaData, FileUploadResponse } = proto.upload;
