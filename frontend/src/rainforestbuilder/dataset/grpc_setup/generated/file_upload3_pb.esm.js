import * as jspb from "google-protobuf";
var goog = jspb;
var global = typeof globalThis !== "undefined" && globalThis || typeof window !== "undefined" && window || typeof global !== "undefined" && global || typeof self !== "undefined" && self || function() {
  return this;
}.call(null) || Function("return this")();
goog.exportSymbol("proto.upload.MapMetaData", null, global);
goog.exportSymbol("proto.upload.MapUploadRequest", null, global);
goog.exportSymbol("proto.upload.MapUploadRequest.DataCase", null, global);
goog.exportSymbol("proto.upload.MapUploadResponse", null, global);
proto.upload.MapUploadRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.upload.MapUploadRequest.oneofGroups_);
};
goog.inherits(proto.upload.MapUploadRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.upload.MapUploadRequest.displayName = "proto.upload.MapUploadRequest";
}
proto.upload.MapMetaData = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.upload.MapMetaData, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.upload.MapMetaData.displayName = "proto.upload.MapMetaData";
}
proto.upload.MapUploadResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.upload.MapUploadResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.upload.MapUploadResponse.displayName = "proto.upload.MapUploadResponse";
}
proto.upload.MapUploadRequest.oneofGroups_ = [[1, 2, 3]];
proto.upload.MapUploadRequest.DataCase = {
  DATA_NOT_SET: 0,
  META_DATA: 1,
  CHUNK_DATA: 2,
  END_SIGNAL: 3
};
proto.upload.MapUploadRequest.prototype.getDataCase = function() {
  return (
    /** @type {proto.upload.MapUploadRequest.DataCase} */
    jspb.Message.computeOneofCase(this, proto.upload.MapUploadRequest.oneofGroups_[0])
  );
};
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.upload.MapUploadRequest.prototype.toObject = function(opt_includeInstance) {
    return proto.upload.MapUploadRequest.toObject(opt_includeInstance, this);
  };
  proto.upload.MapUploadRequest.toObject = function(includeInstance, msg) {
    var f, obj = {
      metaData: (f = msg.getMetaData()) && proto.upload.MapMetaData.toObject(includeInstance, f),
      chunkData: msg.getChunkData_asB64(),
      endSignal: (f = jspb.Message.getBooleanField(msg, 3)) == null ? void 0 : f
    };
    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }
    return obj;
  };
}
proto.upload.MapUploadRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.MapUploadRequest();
  return proto.upload.MapUploadRequest.deserializeBinaryFromReader(msg, reader);
};
proto.upload.MapUploadRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
      case 1:
        var value = new proto.upload.MapMetaData();
        reader.readMessage(value, proto.upload.MapMetaData.deserializeBinaryFromReader);
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
proto.upload.MapUploadRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.MapUploadRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
proto.upload.MapUploadRequest.serializeBinaryToWriter = function(message, writer) {
  var f = void 0;
  f = message.getMetaData();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.upload.MapMetaData.serializeBinaryToWriter
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
proto.upload.MapUploadRequest.prototype.getMetaData = function() {
  return (
    /** @type{?proto.upload.MapMetaData} */
    jspb.Message.getWrapperField(this, proto.upload.MapMetaData, 1)
  );
};
proto.upload.MapUploadRequest.prototype.setMetaData = function(value) {
  return jspb.Message.setOneofWrapperField(this, 1, proto.upload.MapUploadRequest.oneofGroups_[0], value);
};
proto.upload.MapUploadRequest.prototype.clearMetaData = function() {
  return this.setMetaData(void 0);
};
proto.upload.MapUploadRequest.prototype.hasMetaData = function() {
  return jspb.Message.getField(this, 1) != null;
};
proto.upload.MapUploadRequest.prototype.getChunkData = function() {
  return (
    /** @type {!(string|Uint8Array)} */
    jspb.Message.getFieldWithDefault(this, 2, "")
  );
};
proto.upload.MapUploadRequest.prototype.getChunkData_asB64 = function() {
  return (
    /** @type {string} */
    jspb.Message.bytesAsB64(
      this.getChunkData()
    )
  );
};
proto.upload.MapUploadRequest.prototype.getChunkData_asU8 = function() {
  return (
    /** @type {!Uint8Array} */
    jspb.Message.bytesAsU8(
      this.getChunkData()
    )
  );
};
proto.upload.MapUploadRequest.prototype.setChunkData = function(value) {
  return jspb.Message.setOneofField(this, 2, proto.upload.MapUploadRequest.oneofGroups_[0], value);
};
proto.upload.MapUploadRequest.prototype.clearChunkData = function() {
  return jspb.Message.setOneofField(this, 2, proto.upload.MapUploadRequest.oneofGroups_[0], void 0);
};
proto.upload.MapUploadRequest.prototype.hasChunkData = function() {
  return jspb.Message.getField(this, 2) != null;
};
proto.upload.MapUploadRequest.prototype.getEndSignal = function() {
  return (
    /** @type {boolean} */
    jspb.Message.getBooleanFieldWithDefault(this, 3, false)
  );
};
proto.upload.MapUploadRequest.prototype.setEndSignal = function(value) {
  return jspb.Message.setOneofField(this, 3, proto.upload.MapUploadRequest.oneofGroups_[0], value);
};
proto.upload.MapUploadRequest.prototype.clearEndSignal = function() {
  return jspb.Message.setOneofField(this, 3, proto.upload.MapUploadRequest.oneofGroups_[0], void 0);
};
proto.upload.MapUploadRequest.prototype.hasEndSignal = function() {
  return jspb.Message.getField(this, 3) != null;
};
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.upload.MapMetaData.prototype.toObject = function(opt_includeInstance) {
    return proto.upload.MapMetaData.toObject(opt_includeInstance, this);
  };
  proto.upload.MapMetaData.toObject = function(includeInstance, msg) {
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
proto.upload.MapMetaData.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.MapMetaData();
  return proto.upload.MapMetaData.deserializeBinaryFromReader(msg, reader);
};
proto.upload.MapMetaData.deserializeBinaryFromReader = function(msg, reader) {
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
proto.upload.MapMetaData.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.MapMetaData.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
proto.upload.MapMetaData.serializeBinaryToWriter = function(message, writer) {
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
proto.upload.MapMetaData.prototype.getFileName = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 1, "")
  );
};
proto.upload.MapMetaData.prototype.setFileName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};
proto.upload.MapMetaData.prototype.getDescription = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 4, "")
  );
};
proto.upload.MapMetaData.prototype.setDescription = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};
proto.upload.MapMetaData.prototype.getDateCaptured = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 5, "")
  );
};
proto.upload.MapMetaData.prototype.setDateCaptured = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.upload.MapUploadResponse.prototype.toObject = function(opt_includeInstance) {
    return proto.upload.MapUploadResponse.toObject(opt_includeInstance, this);
  };
  proto.upload.MapUploadResponse.toObject = function(includeInstance, msg) {
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
proto.upload.MapUploadResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.MapUploadResponse();
  return proto.upload.MapUploadResponse.deserializeBinaryFromReader(msg, reader);
};
proto.upload.MapUploadResponse.deserializeBinaryFromReader = function(msg, reader) {
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
proto.upload.MapUploadResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.MapUploadResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
proto.upload.MapUploadResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.upload.MapUploadResponse.prototype.getSuccess = function() {
  return (
    /** @type {boolean} */
    jspb.Message.getBooleanFieldWithDefault(this, 1, false)
  );
};
proto.upload.MapUploadResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};
proto.upload.MapUploadResponse.prototype.getMessage = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 2, "")
  );
};
proto.upload.MapUploadResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};
proto.upload.MapUploadResponse.prototype.getChunkNumber = function() {
  return (
    /** @type {number} */
    jspb.Message.getFieldWithDefault(this, 3, 0)
  );
};
proto.upload.MapUploadResponse.prototype.setChunkNumber = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};
export const { MapUploadRequest, MapMetaData, MapUploadResponse } = proto.upload;
