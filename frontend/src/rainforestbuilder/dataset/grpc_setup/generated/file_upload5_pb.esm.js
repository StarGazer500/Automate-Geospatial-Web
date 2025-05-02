import * as jspb from "google-protobuf";
var goog = jspb;
var global = typeof globalThis !== "undefined" && globalThis || typeof window !== "undefined" && window || typeof global !== "undefined" && global || typeof self !== "undefined" && self || function() {
  return this;
}.call(null) || Function("return this")();
goog.exportSymbol("proto.upload.FileMetaData1", null, global);
goog.exportSymbol("proto.upload.FileUploadRequest1", null, global);
goog.exportSymbol("proto.upload.FileUploadRequest1.DataCase", null, global);
goog.exportSymbol("proto.upload.FileUploadResponse1", null, global);
proto.upload.FileUploadRequest1 = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.upload.FileUploadRequest1.oneofGroups_);
};
goog.inherits(proto.upload.FileUploadRequest1, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.upload.FileUploadRequest1.displayName = "proto.upload.FileUploadRequest1";
}
proto.upload.FileMetaData1 = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.upload.FileMetaData1, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.upload.FileMetaData1.displayName = "proto.upload.FileMetaData1";
}
proto.upload.FileUploadResponse1 = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.upload.FileUploadResponse1, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.upload.FileUploadResponse1.displayName = "proto.upload.FileUploadResponse1";
}
proto.upload.FileUploadRequest1.oneofGroups_ = [[2, 3, 4]];
proto.upload.FileUploadRequest1.DataCase = {
  DATA_NOT_SET: 0,
  META_DATA: 2,
  CHUNK_DATA: 3,
  END_SIGNAL: 4
};
proto.upload.FileUploadRequest1.prototype.getDataCase = function() {
  return (
    /** @type {proto.upload.FileUploadRequest1.DataCase} */
    jspb.Message.computeOneofCase(this, proto.upload.FileUploadRequest1.oneofGroups_[0])
  );
};
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.upload.FileUploadRequest1.prototype.toObject = function(opt_includeInstance) {
    return proto.upload.FileUploadRequest1.toObject(opt_includeInstance, this);
  };
  proto.upload.FileUploadRequest1.toObject = function(includeInstance, msg) {
    var f, obj = {
      fileName: jspb.Message.getFieldWithDefault(msg, 1, ""),
      metaData: (f = msg.getMetaData()) && proto.upload.FileMetaData1.toObject(includeInstance, f),
      chunkData: msg.getChunkData_asB64(),
      endSignal: (f = jspb.Message.getBooleanField(msg, 4)) == null ? void 0 : f
    };
    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }
    return obj;
  };
}
proto.upload.FileUploadRequest1.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.FileUploadRequest1();
  return proto.upload.FileUploadRequest1.deserializeBinaryFromReader(msg, reader);
};
proto.upload.FileUploadRequest1.deserializeBinaryFromReader = function(msg, reader) {
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
        var value = new proto.upload.FileMetaData1();
        reader.readMessage(value, proto.upload.FileMetaData1.deserializeBinaryFromReader);
        msg.setMetaData(value);
        break;
      case 3:
        var value = (
          /** @type {!Uint8Array} */
          reader.readBytes()
        );
        msg.setChunkData(value);
        break;
      case 4:
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
proto.upload.FileUploadRequest1.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.FileUploadRequest1.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
proto.upload.FileUploadRequest1.serializeBinaryToWriter = function(message, writer) {
  var f = void 0;
  f = message.getFileName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getMetaData();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.upload.FileMetaData1.serializeBinaryToWriter
    );
  }
  f = /** @type {!(string|Uint8Array)} */
  jspb.Message.getField(message, 3);
  if (f != null) {
    writer.writeBytes(
      3,
      f
    );
  }
  f = /** @type {boolean} */
  jspb.Message.getField(message, 4);
  if (f != null) {
    writer.writeBool(
      4,
      f
    );
  }
};
proto.upload.FileUploadRequest1.prototype.getFileName = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 1, "")
  );
};
proto.upload.FileUploadRequest1.prototype.setFileName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};
proto.upload.FileUploadRequest1.prototype.getMetaData = function() {
  return (
    /** @type{?proto.upload.FileMetaData1} */
    jspb.Message.getWrapperField(this, proto.upload.FileMetaData1, 2)
  );
};
proto.upload.FileUploadRequest1.prototype.setMetaData = function(value) {
  return jspb.Message.setOneofWrapperField(this, 2, proto.upload.FileUploadRequest1.oneofGroups_[0], value);
};
proto.upload.FileUploadRequest1.prototype.clearMetaData = function() {
  return this.setMetaData(void 0);
};
proto.upload.FileUploadRequest1.prototype.hasMetaData = function() {
  return jspb.Message.getField(this, 2) != null;
};
proto.upload.FileUploadRequest1.prototype.getChunkData = function() {
  return (
    /** @type {!(string|Uint8Array)} */
    jspb.Message.getFieldWithDefault(this, 3, "")
  );
};
proto.upload.FileUploadRequest1.prototype.getChunkData_asB64 = function() {
  return (
    /** @type {string} */
    jspb.Message.bytesAsB64(
      this.getChunkData()
    )
  );
};
proto.upload.FileUploadRequest1.prototype.getChunkData_asU8 = function() {
  return (
    /** @type {!Uint8Array} */
    jspb.Message.bytesAsU8(
      this.getChunkData()
    )
  );
};
proto.upload.FileUploadRequest1.prototype.setChunkData = function(value) {
  return jspb.Message.setOneofField(this, 3, proto.upload.FileUploadRequest1.oneofGroups_[0], value);
};
proto.upload.FileUploadRequest1.prototype.clearChunkData = function() {
  return jspb.Message.setOneofField(this, 3, proto.upload.FileUploadRequest1.oneofGroups_[0], void 0);
};
proto.upload.FileUploadRequest1.prototype.hasChunkData = function() {
  return jspb.Message.getField(this, 3) != null;
};
proto.upload.FileUploadRequest1.prototype.getEndSignal = function() {
  return (
    /** @type {boolean} */
    jspb.Message.getBooleanFieldWithDefault(this, 4, false)
  );
};
proto.upload.FileUploadRequest1.prototype.setEndSignal = function(value) {
  return jspb.Message.setOneofField(this, 4, proto.upload.FileUploadRequest1.oneofGroups_[0], value);
};
proto.upload.FileUploadRequest1.prototype.clearEndSignal = function() {
  return jspb.Message.setOneofField(this, 4, proto.upload.FileUploadRequest1.oneofGroups_[0], void 0);
};
proto.upload.FileUploadRequest1.prototype.hasEndSignal = function() {
  return jspb.Message.getField(this, 4) != null;
};
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.upload.FileMetaData1.prototype.toObject = function(opt_includeInstance) {
    return proto.upload.FileMetaData1.toObject(opt_includeInstance, this);
  };
  proto.upload.FileMetaData1.toObject = function(includeInstance, msg) {
    var f, obj = {
      fileName: jspb.Message.getFieldWithDefault(msg, 1, ""),
      fileId: jspb.Message.getFieldWithDefault(msg, 2, 0),
      dataCategory: jspb.Message.getFieldWithDefault(msg, 3, "")
    };
    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }
    return obj;
  };
}
proto.upload.FileMetaData1.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.FileMetaData1();
  return proto.upload.FileMetaData1.deserializeBinaryFromReader(msg, reader);
};
proto.upload.FileMetaData1.deserializeBinaryFromReader = function(msg, reader) {
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
          /** @type {number} */
          reader.readInt32()
        );
        msg.setFileId(value);
        break;
      case 3:
        var value = (
          /** @type {string} */
          reader.readString()
        );
        msg.setDataCategory(value);
        break;
      default:
        reader.skipField();
        break;
    }
  }
  return msg;
};
proto.upload.FileMetaData1.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.FileMetaData1.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
proto.upload.FileMetaData1.serializeBinaryToWriter = function(message, writer) {
  var f = void 0;
  f = message.getFileName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getFileId();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
  f = message.getDataCategory();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};
proto.upload.FileMetaData1.prototype.getFileName = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 1, "")
  );
};
proto.upload.FileMetaData1.prototype.setFileName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};
proto.upload.FileMetaData1.prototype.getFileId = function() {
  return (
    /** @type {number} */
    jspb.Message.getFieldWithDefault(this, 2, 0)
  );
};
proto.upload.FileMetaData1.prototype.setFileId = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};
proto.upload.FileMetaData1.prototype.getDataCategory = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 3, "")
  );
};
proto.upload.FileMetaData1.prototype.setDataCategory = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.upload.FileUploadResponse1.prototype.toObject = function(opt_includeInstance) {
    return proto.upload.FileUploadResponse1.toObject(opt_includeInstance, this);
  };
  proto.upload.FileUploadResponse1.toObject = function(includeInstance, msg) {
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
proto.upload.FileUploadResponse1.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.FileUploadResponse1();
  return proto.upload.FileUploadResponse1.deserializeBinaryFromReader(msg, reader);
};
proto.upload.FileUploadResponse1.deserializeBinaryFromReader = function(msg, reader) {
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
proto.upload.FileUploadResponse1.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.FileUploadResponse1.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
proto.upload.FileUploadResponse1.serializeBinaryToWriter = function(message, writer) {
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
proto.upload.FileUploadResponse1.prototype.getSuccess = function() {
  return (
    /** @type {boolean} */
    jspb.Message.getBooleanFieldWithDefault(this, 1, false)
  );
};
proto.upload.FileUploadResponse1.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};
proto.upload.FileUploadResponse1.prototype.getMessage = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 2, "")
  );
};
proto.upload.FileUploadResponse1.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};
proto.upload.FileUploadResponse1.prototype.getChunkNumber = function() {
  return (
    /** @type {number} */
    jspb.Message.getFieldWithDefault(this, 3, 0)
  );
};
proto.upload.FileUploadResponse1.prototype.setChunkNumber = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};
export const {FileUploadRequest1, FileMetaData1, FileUploadResponse1} = proto.upload;
