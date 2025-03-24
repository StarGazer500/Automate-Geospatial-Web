import * as jspb from "google-protobuf";
var goog = jspb;
var global = typeof globalThis !== "undefined" && globalThis || typeof window !== "undefined" && window || typeof global !== "undefined" && global || typeof self !== "undefined" && self || function() {
  return this;
}.call(null) || Function("return this")();
goog.exportSymbol("proto.upload.DocumentMetaData", null, global);
goog.exportSymbol("proto.upload.DocumentUploadRequest", null, global);
goog.exportSymbol("proto.upload.DocumentUploadRequest.DataCase", null, global);
goog.exportSymbol("proto.upload.DocumentUploadResponse", null, global);
proto.upload.DocumentUploadRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.upload.DocumentUploadRequest.oneofGroups_);
};
goog.inherits(proto.upload.DocumentUploadRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.upload.DocumentUploadRequest.displayName = "proto.upload.DocumentUploadRequest";
}
proto.upload.DocumentMetaData = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.upload.DocumentMetaData, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.upload.DocumentMetaData.displayName = "proto.upload.DocumentMetaData";
}
proto.upload.DocumentUploadResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.upload.DocumentUploadResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.upload.DocumentUploadResponse.displayName = "proto.upload.DocumentUploadResponse";
}
proto.upload.DocumentUploadRequest.oneofGroups_ = [[1, 2, 3]];
proto.upload.DocumentUploadRequest.DataCase = {
  DATA_NOT_SET: 0,
  META_DATA: 1,
  CHUNK_DATA: 2,
  END_SIGNAL: 3
};
proto.upload.DocumentUploadRequest.prototype.getDataCase = function() {
  return (
    /** @type {proto.upload.DocumentUploadRequest.DataCase} */
    jspb.Message.computeOneofCase(this, proto.upload.DocumentUploadRequest.oneofGroups_[0])
  );
};
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.upload.DocumentUploadRequest.prototype.toObject = function(opt_includeInstance) {
    return proto.upload.DocumentUploadRequest.toObject(opt_includeInstance, this);
  };
  proto.upload.DocumentUploadRequest.toObject = function(includeInstance, msg) {
    var f, obj = {
      metaData: (f = msg.getMetaData()) && proto.upload.DocumentMetaData.toObject(includeInstance, f),
      chunkData: msg.getChunkData_asB64(),
      endSignal: (f = jspb.Message.getBooleanField(msg, 3)) == null ? void 0 : f
    };
    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }
    return obj;
  };
}
proto.upload.DocumentUploadRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.DocumentUploadRequest();
  return proto.upload.DocumentUploadRequest.deserializeBinaryFromReader(msg, reader);
};
proto.upload.DocumentUploadRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
      case 1:
        var value = new proto.upload.DocumentMetaData();
        reader.readMessage(value, proto.upload.DocumentMetaData.deserializeBinaryFromReader);
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
proto.upload.DocumentUploadRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.DocumentUploadRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
proto.upload.DocumentUploadRequest.serializeBinaryToWriter = function(message, writer) {
  var f = void 0;
  f = message.getMetaData();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.upload.DocumentMetaData.serializeBinaryToWriter
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
proto.upload.DocumentUploadRequest.prototype.getMetaData = function() {
  return (
    /** @type{?proto.upload.DocumentMetaData} */
    jspb.Message.getWrapperField(this, proto.upload.DocumentMetaData, 1)
  );
};
proto.upload.DocumentUploadRequest.prototype.setMetaData = function(value) {
  return jspb.Message.setOneofWrapperField(this, 1, proto.upload.DocumentUploadRequest.oneofGroups_[0], value);
};
proto.upload.DocumentUploadRequest.prototype.clearMetaData = function() {
  return this.setMetaData(void 0);
};
proto.upload.DocumentUploadRequest.prototype.hasMetaData = function() {
  return jspb.Message.getField(this, 1) != null;
};
proto.upload.DocumentUploadRequest.prototype.getChunkData = function() {
  return (
    /** @type {!(string|Uint8Array)} */
    jspb.Message.getFieldWithDefault(this, 2, "")
  );
};
proto.upload.DocumentUploadRequest.prototype.getChunkData_asB64 = function() {
  return (
    /** @type {string} */
    jspb.Message.bytesAsB64(
      this.getChunkData()
    )
  );
};
proto.upload.DocumentUploadRequest.prototype.getChunkData_asU8 = function() {
  return (
    /** @type {!Uint8Array} */
    jspb.Message.bytesAsU8(
      this.getChunkData()
    )
  );
};
proto.upload.DocumentUploadRequest.prototype.setChunkData = function(value) {
  return jspb.Message.setOneofField(this, 2, proto.upload.DocumentUploadRequest.oneofGroups_[0], value);
};
proto.upload.DocumentUploadRequest.prototype.clearChunkData = function() {
  return jspb.Message.setOneofField(this, 2, proto.upload.DocumentUploadRequest.oneofGroups_[0], void 0);
};
proto.upload.DocumentUploadRequest.prototype.hasChunkData = function() {
  return jspb.Message.getField(this, 2) != null;
};
proto.upload.DocumentUploadRequest.prototype.getEndSignal = function() {
  return (
    /** @type {boolean} */
    jspb.Message.getBooleanFieldWithDefault(this, 3, false)
  );
};
proto.upload.DocumentUploadRequest.prototype.setEndSignal = function(value) {
  return jspb.Message.setOneofField(this, 3, proto.upload.DocumentUploadRequest.oneofGroups_[0], value);
};
proto.upload.DocumentUploadRequest.prototype.clearEndSignal = function() {
  return jspb.Message.setOneofField(this, 3, proto.upload.DocumentUploadRequest.oneofGroups_[0], void 0);
};
proto.upload.DocumentUploadRequest.prototype.hasEndSignal = function() {
  return jspb.Message.getField(this, 3) != null;
};
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.upload.DocumentMetaData.prototype.toObject = function(opt_includeInstance) {
    return proto.upload.DocumentMetaData.toObject(opt_includeInstance, this);
  };
  proto.upload.DocumentMetaData.toObject = function(includeInstance, msg) {
    var f, obj = {
      fileName: jspb.Message.getFieldWithDefault(msg, 1, ""),
      description: jspb.Message.getFieldWithDefault(msg, 4, ""),
      dateCaptured: jspb.Message.getFieldWithDefault(msg, 5, "")
    };
    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }
    return obj;
  };
}
proto.upload.DocumentMetaData.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.DocumentMetaData();
  return proto.upload.DocumentMetaData.deserializeBinaryFromReader(msg, reader);
};
proto.upload.DocumentMetaData.deserializeBinaryFromReader = function(msg, reader) {
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
proto.upload.DocumentMetaData.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.DocumentMetaData.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
proto.upload.DocumentMetaData.serializeBinaryToWriter = function(message, writer) {
  var f = void 0;
  f = message.getFileName();
  if (f.length > 0) {
    writer.writeString(
      1,
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
proto.upload.DocumentMetaData.prototype.getFileName = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 1, "")
  );
};
proto.upload.DocumentMetaData.prototype.setFileName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};
proto.upload.DocumentMetaData.prototype.getDescription = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 4, "")
  );
};
proto.upload.DocumentMetaData.prototype.setDescription = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};
proto.upload.DocumentMetaData.prototype.getDateCaptured = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 5, "")
  );
};
proto.upload.DocumentMetaData.prototype.setDateCaptured = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.upload.DocumentUploadResponse.prototype.toObject = function(opt_includeInstance) {
    return proto.upload.DocumentUploadResponse.toObject(opt_includeInstance, this);
  };
  proto.upload.DocumentUploadResponse.toObject = function(includeInstance, msg) {
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
proto.upload.DocumentUploadResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.DocumentUploadResponse();
  return proto.upload.DocumentUploadResponse.deserializeBinaryFromReader(msg, reader);
};
proto.upload.DocumentUploadResponse.deserializeBinaryFromReader = function(msg, reader) {
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
proto.upload.DocumentUploadResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.DocumentUploadResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
proto.upload.DocumentUploadResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.upload.DocumentUploadResponse.prototype.getSuccess = function() {
  return (
    /** @type {boolean} */
    jspb.Message.getBooleanFieldWithDefault(this, 1, false)
  );
};
proto.upload.DocumentUploadResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};
proto.upload.DocumentUploadResponse.prototype.getMessage = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 2, "")
  );
};
proto.upload.DocumentUploadResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};
proto.upload.DocumentUploadResponse.prototype.getChunkNumber = function() {
  return (
    /** @type {number} */
    jspb.Message.getFieldWithDefault(this, 3, 0)
  );
};
proto.upload.DocumentUploadResponse.prototype.setChunkNumber = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};
export const { DocumentUploadRequest,DocumentMetaData, DocumentUploadResponse } = proto.upload;
