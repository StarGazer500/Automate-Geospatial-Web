import * as jspb from "google-protobuf";
var goog = jspb;
var global = typeof globalThis !== "undefined" && globalThis || typeof window !== "undefined" && window || typeof global !== "undefined" && global || typeof self !== "undefined" && self || function() {
  return this;
}.call(null) || Function("return this")();
goog.exportSymbol("proto.upload.AnalysisAnalysisAssetMetaData", null, global);
goog.exportSymbol("proto.upload.AnalysisDocumentMetaData", null, global);
goog.exportSymbol("proto.upload.AnalysisFileUploadRequest", null, global);
goog.exportSymbol("proto.upload.AnalysisFileUploadRequest.DataCase", null, global);
goog.exportSymbol("proto.upload.AnalysisFileUploadResponse", null, global);
goog.exportSymbol("proto.upload.AnalysisInputFileMetaData", null, global);
goog.exportSymbol("proto.upload.AnalysisMapMetaData", null, global);
goog.exportSymbol("proto.upload.AnalysisOutputFileMetaData", null, global);
proto.upload.AnalysisFileUploadRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.upload.AnalysisFileUploadRequest.oneofGroups_);
};
goog.inherits(proto.upload.AnalysisFileUploadRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.upload.AnalysisFileUploadRequest.displayName = "proto.upload.AnalysisFileUploadRequest";
}
proto.upload.AnalysisInputFileMetaData = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.upload.AnalysisInputFileMetaData, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.upload.AnalysisInputFileMetaData.displayName = "proto.upload.AnalysisInputFileMetaData";
}
proto.upload.AnalysisOutputFileMetaData = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.upload.AnalysisOutputFileMetaData, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.upload.AnalysisOutputFileMetaData.displayName = "proto.upload.AnalysisOutputFileMetaData";
}
proto.upload.AnalysisDocumentMetaData = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.upload.AnalysisDocumentMetaData, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.upload.AnalysisDocumentMetaData.displayName = "proto.upload.AnalysisDocumentMetaData";
}
proto.upload.AnalysisMapMetaData = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.upload.AnalysisMapMetaData, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.upload.AnalysisMapMetaData.displayName = "proto.upload.AnalysisMapMetaData";
}
proto.upload.AnalysisAnalysisAssetMetaData = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.upload.AnalysisAnalysisAssetMetaData, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.upload.AnalysisAnalysisAssetMetaData.displayName = "proto.upload.AnalysisAnalysisAssetMetaData";
}
proto.upload.AnalysisFileUploadResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.upload.AnalysisFileUploadResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.upload.AnalysisFileUploadResponse.displayName = "proto.upload.AnalysisFileUploadResponse";
}
proto.upload.AnalysisFileUploadRequest.oneofGroups_ = [[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]];
proto.upload.AnalysisFileUploadRequest.DataCase = {
  DATA_NOT_SET: 0,
  INPUT_META_DATA: 3,
  OUTPUT_META_DATA: 4,
  DOCUMENT_META_DATA: 5,
  MAP_META_DATA: 6,
  ANALYSIS_META_DATA: 7,
  INPUT_GEO_CHUNK_DATA: 8,
  OUTPUT_GEO_CHUNK_DATA: 9,
  MAP_CHUNK_DATA: 10,
  DOC_CHUNK_DATA: 11,
  ANALYSIS_CHUNK_DATA: 12,
  END_SIGNAL: 13
};
proto.upload.AnalysisFileUploadRequest.prototype.getDataCase = function() {
  return (
    /** @type {proto.upload.AnalysisFileUploadRequest.DataCase} */
    jspb.Message.computeOneofCase(this, proto.upload.AnalysisFileUploadRequest.oneofGroups_[0])
  );
};
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.upload.AnalysisFileUploadRequest.prototype.toObject = function(opt_includeInstance) {
    return proto.upload.AnalysisFileUploadRequest.toObject(opt_includeInstance, this);
  };
  proto.upload.AnalysisFileUploadRequest.toObject = function(includeInstance, msg) {
    var f, obj = {
      inputGeoFileName: jspb.Message.getFieldWithDefault(msg, 1, ""),
      outputGeoFileName: jspb.Message.getFieldWithDefault(msg, 2, ""),
      inputMetaData: (f = msg.getInputMetaData()) && proto.upload.AnalysisInputFileMetaData.toObject(includeInstance, f),
      outputMetaData: (f = msg.getOutputMetaData()) && proto.upload.AnalysisOutputFileMetaData.toObject(includeInstance, f),
      documentMetaData: (f = msg.getDocumentMetaData()) && proto.upload.AnalysisDocumentMetaData.toObject(includeInstance, f),
      mapMetaData: (f = msg.getMapMetaData()) && proto.upload.AnalysisMapMetaData.toObject(includeInstance, f),
      analysisMetaData: (f = msg.getAnalysisMetaData()) && proto.upload.AnalysisAnalysisAssetMetaData.toObject(includeInstance, f),
      inputGeoChunkData: msg.getInputGeoChunkData_asB64(),
      outputGeoChunkData: msg.getOutputGeoChunkData_asB64(),
      mapChunkData: msg.getMapChunkData_asB64(),
      docChunkData: msg.getDocChunkData_asB64(),
      analysisChunkData: msg.getAnalysisChunkData_asB64(),
      endSignal: (f = jspb.Message.getBooleanField(msg, 13)) == null ? void 0 : f
    };
    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }
    return obj;
  };
}
proto.upload.AnalysisFileUploadRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.AnalysisFileUploadRequest();
  return proto.upload.AnalysisFileUploadRequest.deserializeBinaryFromReader(msg, reader);
};
proto.upload.AnalysisFileUploadRequest.deserializeBinaryFromReader = function(msg, reader) {
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
        msg.setInputGeoFileName(value);
        break;
      case 2:
        var value = (
          /** @type {string} */
          reader.readString()
        );
        msg.setOutputGeoFileName(value);
        break;
      case 3:
        var value = new proto.upload.AnalysisInputFileMetaData();
        reader.readMessage(value, proto.upload.AnalysisInputFileMetaData.deserializeBinaryFromReader);
        msg.setInputMetaData(value);
        break;
      case 4:
        var value = new proto.upload.AnalysisOutputFileMetaData();
        reader.readMessage(value, proto.upload.AnalysisOutputFileMetaData.deserializeBinaryFromReader);
        msg.setOutputMetaData(value);
        break;
      case 5:
        var value = new proto.upload.AnalysisDocumentMetaData();
        reader.readMessage(value, proto.upload.AnalysisDocumentMetaData.deserializeBinaryFromReader);
        msg.setDocumentMetaData(value);
        break;
      case 6:
        var value = new proto.upload.AnalysisMapMetaData();
        reader.readMessage(value, proto.upload.AnalysisMapMetaData.deserializeBinaryFromReader);
        msg.setMapMetaData(value);
        break;
      case 7:
        var value = new proto.upload.AnalysisAnalysisAssetMetaData();
        reader.readMessage(value, proto.upload.AnalysisAnalysisAssetMetaData.deserializeBinaryFromReader);
        msg.setAnalysisMetaData(value);
        break;
      case 8:
        var value = (
          /** @type {!Uint8Array} */
          reader.readBytes()
        );
        msg.setInputGeoChunkData(value);
        break;
      case 9:
        var value = (
          /** @type {!Uint8Array} */
          reader.readBytes()
        );
        msg.setOutputGeoChunkData(value);
        break;
      case 10:
        var value = (
          /** @type {!Uint8Array} */
          reader.readBytes()
        );
        msg.setMapChunkData(value);
        break;
      case 11:
        var value = (
          /** @type {!Uint8Array} */
          reader.readBytes()
        );
        msg.setDocChunkData(value);
        break;
      case 12:
        var value = (
          /** @type {!Uint8Array} */
          reader.readBytes()
        );
        msg.setAnalysisChunkData(value);
        break;
      case 13:
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
proto.upload.AnalysisFileUploadRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.AnalysisFileUploadRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
proto.upload.AnalysisFileUploadRequest.serializeBinaryToWriter = function(message, writer) {
  var f = void 0;
  f = message.getInputGeoFileName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getOutputGeoFileName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getInputMetaData();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.upload.AnalysisInputFileMetaData.serializeBinaryToWriter
    );
  }
  f = message.getOutputMetaData();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.upload.AnalysisOutputFileMetaData.serializeBinaryToWriter
    );
  }
  f = message.getDocumentMetaData();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.upload.AnalysisDocumentMetaData.serializeBinaryToWriter
    );
  }
  f = message.getMapMetaData();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      proto.upload.AnalysisMapMetaData.serializeBinaryToWriter
    );
  }
  f = message.getAnalysisMetaData();
  if (f != null) {
    writer.writeMessage(
      7,
      f,
      proto.upload.AnalysisAnalysisAssetMetaData.serializeBinaryToWriter
    );
  }
  f = /** @type {!(string|Uint8Array)} */
  jspb.Message.getField(message, 8);
  if (f != null) {
    writer.writeBytes(
      8,
      f
    );
  }
  f = /** @type {!(string|Uint8Array)} */
  jspb.Message.getField(message, 9);
  if (f != null) {
    writer.writeBytes(
      9,
      f
    );
  }
  f = /** @type {!(string|Uint8Array)} */
  jspb.Message.getField(message, 10);
  if (f != null) {
    writer.writeBytes(
      10,
      f
    );
  }
  f = /** @type {!(string|Uint8Array)} */
  jspb.Message.getField(message, 11);
  if (f != null) {
    writer.writeBytes(
      11,
      f
    );
  }
  f = /** @type {!(string|Uint8Array)} */
  jspb.Message.getField(message, 12);
  if (f != null) {
    writer.writeBytes(
      12,
      f
    );
  }
  f = /** @type {boolean} */
  jspb.Message.getField(message, 13);
  if (f != null) {
    writer.writeBool(
      13,
      f
    );
  }
};
proto.upload.AnalysisFileUploadRequest.prototype.getInputGeoFileName = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 1, "")
  );
};
proto.upload.AnalysisFileUploadRequest.prototype.setInputGeoFileName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};
proto.upload.AnalysisFileUploadRequest.prototype.getOutputGeoFileName = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 2, "")
  );
};
proto.upload.AnalysisFileUploadRequest.prototype.setOutputGeoFileName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};
proto.upload.AnalysisFileUploadRequest.prototype.getInputMetaData = function() {
  return (
    /** @type{?proto.upload.AnalysisInputFileMetaData} */
    jspb.Message.getWrapperField(this, proto.upload.AnalysisInputFileMetaData, 3)
  );
};
proto.upload.AnalysisFileUploadRequest.prototype.setInputMetaData = function(value) {
  return jspb.Message.setOneofWrapperField(this, 3, proto.upload.AnalysisFileUploadRequest.oneofGroups_[0], value);
};
proto.upload.AnalysisFileUploadRequest.prototype.clearInputMetaData = function() {
  return this.setInputMetaData(void 0);
};
proto.upload.AnalysisFileUploadRequest.prototype.hasInputMetaData = function() {
  return jspb.Message.getField(this, 3) != null;
};
proto.upload.AnalysisFileUploadRequest.prototype.getOutputMetaData = function() {
  return (
    /** @type{?proto.upload.AnalysisOutputFileMetaData} */
    jspb.Message.getWrapperField(this, proto.upload.AnalysisOutputFileMetaData, 4)
  );
};
proto.upload.AnalysisFileUploadRequest.prototype.setOutputMetaData = function(value) {
  return jspb.Message.setOneofWrapperField(this, 4, proto.upload.AnalysisFileUploadRequest.oneofGroups_[0], value);
};
proto.upload.AnalysisFileUploadRequest.prototype.clearOutputMetaData = function() {
  return this.setOutputMetaData(void 0);
};
proto.upload.AnalysisFileUploadRequest.prototype.hasOutputMetaData = function() {
  return jspb.Message.getField(this, 4) != null;
};
proto.upload.AnalysisFileUploadRequest.prototype.getDocumentMetaData = function() {
  return (
    /** @type{?proto.upload.AnalysisDocumentMetaData} */
    jspb.Message.getWrapperField(this, proto.upload.AnalysisDocumentMetaData, 5)
  );
};
proto.upload.AnalysisFileUploadRequest.prototype.setDocumentMetaData = function(value) {
  return jspb.Message.setOneofWrapperField(this, 5, proto.upload.AnalysisFileUploadRequest.oneofGroups_[0], value);
};
proto.upload.AnalysisFileUploadRequest.prototype.clearDocumentMetaData = function() {
  return this.setDocumentMetaData(void 0);
};
proto.upload.AnalysisFileUploadRequest.prototype.hasDocumentMetaData = function() {
  return jspb.Message.getField(this, 5) != null;
};
proto.upload.AnalysisFileUploadRequest.prototype.getMapMetaData = function() {
  return (
    /** @type{?proto.upload.AnalysisMapMetaData} */
    jspb.Message.getWrapperField(this, proto.upload.AnalysisMapMetaData, 6)
  );
};
proto.upload.AnalysisFileUploadRequest.prototype.setMapMetaData = function(value) {
  return jspb.Message.setOneofWrapperField(this, 6, proto.upload.AnalysisFileUploadRequest.oneofGroups_[0], value);
};
proto.upload.AnalysisFileUploadRequest.prototype.clearMapMetaData = function() {
  return this.setMapMetaData(void 0);
};
proto.upload.AnalysisFileUploadRequest.prototype.hasMapMetaData = function() {
  return jspb.Message.getField(this, 6) != null;
};
proto.upload.AnalysisFileUploadRequest.prototype.getAnalysisMetaData = function() {
  return (
    /** @type{?proto.upload.AnalysisAnalysisAssetMetaData} */
    jspb.Message.getWrapperField(this, proto.upload.AnalysisAnalysisAssetMetaData, 7)
  );
};
proto.upload.AnalysisFileUploadRequest.prototype.setAnalysisMetaData = function(value) {
  return jspb.Message.setOneofWrapperField(this, 7, proto.upload.AnalysisFileUploadRequest.oneofGroups_[0], value);
};
proto.upload.AnalysisFileUploadRequest.prototype.clearAnalysisMetaData = function() {
  return this.setAnalysisMetaData(void 0);
};
proto.upload.AnalysisFileUploadRequest.prototype.hasAnalysisMetaData = function() {
  return jspb.Message.getField(this, 7) != null;
};
proto.upload.AnalysisFileUploadRequest.prototype.getInputGeoChunkData = function() {
  return (
    /** @type {!(string|Uint8Array)} */
    jspb.Message.getFieldWithDefault(this, 8, "")
  );
};
proto.upload.AnalysisFileUploadRequest.prototype.getInputGeoChunkData_asB64 = function() {
  return (
    /** @type {string} */
    jspb.Message.bytesAsB64(
      this.getInputGeoChunkData()
    )
  );
};
proto.upload.AnalysisFileUploadRequest.prototype.getInputGeoChunkData_asU8 = function() {
  return (
    /** @type {!Uint8Array} */
    jspb.Message.bytesAsU8(
      this.getInputGeoChunkData()
    )
  );
};
proto.upload.AnalysisFileUploadRequest.prototype.setInputGeoChunkData = function(value) {
  return jspb.Message.setOneofField(this, 8, proto.upload.AnalysisFileUploadRequest.oneofGroups_[0], value);
};
proto.upload.AnalysisFileUploadRequest.prototype.clearInputGeoChunkData = function() {
  return jspb.Message.setOneofField(this, 8, proto.upload.AnalysisFileUploadRequest.oneofGroups_[0], void 0);
};
proto.upload.AnalysisFileUploadRequest.prototype.hasInputGeoChunkData = function() {
  return jspb.Message.getField(this, 8) != null;
};
proto.upload.AnalysisFileUploadRequest.prototype.getOutputGeoChunkData = function() {
  return (
    /** @type {!(string|Uint8Array)} */
    jspb.Message.getFieldWithDefault(this, 9, "")
  );
};
proto.upload.AnalysisFileUploadRequest.prototype.getOutputGeoChunkData_asB64 = function() {
  return (
    /** @type {string} */
    jspb.Message.bytesAsB64(
      this.getOutputGeoChunkData()
    )
  );
};
proto.upload.AnalysisFileUploadRequest.prototype.getOutputGeoChunkData_asU8 = function() {
  return (
    /** @type {!Uint8Array} */
    jspb.Message.bytesAsU8(
      this.getOutputGeoChunkData()
    )
  );
};
proto.upload.AnalysisFileUploadRequest.prototype.setOutputGeoChunkData = function(value) {
  return jspb.Message.setOneofField(this, 9, proto.upload.AnalysisFileUploadRequest.oneofGroups_[0], value);
};
proto.upload.AnalysisFileUploadRequest.prototype.clearOutputGeoChunkData = function() {
  return jspb.Message.setOneofField(this, 9, proto.upload.AnalysisFileUploadRequest.oneofGroups_[0], void 0);
};
proto.upload.AnalysisFileUploadRequest.prototype.hasOutputGeoChunkData = function() {
  return jspb.Message.getField(this, 9) != null;
};
proto.upload.AnalysisFileUploadRequest.prototype.getMapChunkData = function() {
  return (
    /** @type {!(string|Uint8Array)} */
    jspb.Message.getFieldWithDefault(this, 10, "")
  );
};
proto.upload.AnalysisFileUploadRequest.prototype.getMapChunkData_asB64 = function() {
  return (
    /** @type {string} */
    jspb.Message.bytesAsB64(
      this.getMapChunkData()
    )
  );
};
proto.upload.AnalysisFileUploadRequest.prototype.getMapChunkData_asU8 = function() {
  return (
    /** @type {!Uint8Array} */
    jspb.Message.bytesAsU8(
      this.getMapChunkData()
    )
  );
};
proto.upload.AnalysisFileUploadRequest.prototype.setMapChunkData = function(value) {
  return jspb.Message.setOneofField(this, 10, proto.upload.AnalysisFileUploadRequest.oneofGroups_[0], value);
};
proto.upload.AnalysisFileUploadRequest.prototype.clearMapChunkData = function() {
  return jspb.Message.setOneofField(this, 10, proto.upload.AnalysisFileUploadRequest.oneofGroups_[0], void 0);
};
proto.upload.AnalysisFileUploadRequest.prototype.hasMapChunkData = function() {
  return jspb.Message.getField(this, 10) != null;
};
proto.upload.AnalysisFileUploadRequest.prototype.getDocChunkData = function() {
  return (
    /** @type {!(string|Uint8Array)} */
    jspb.Message.getFieldWithDefault(this, 11, "")
  );
};
proto.upload.AnalysisFileUploadRequest.prototype.getDocChunkData_asB64 = function() {
  return (
    /** @type {string} */
    jspb.Message.bytesAsB64(
      this.getDocChunkData()
    )
  );
};
proto.upload.AnalysisFileUploadRequest.prototype.getDocChunkData_asU8 = function() {
  return (
    /** @type {!Uint8Array} */
    jspb.Message.bytesAsU8(
      this.getDocChunkData()
    )
  );
};
proto.upload.AnalysisFileUploadRequest.prototype.setDocChunkData = function(value) {
  return jspb.Message.setOneofField(this, 11, proto.upload.AnalysisFileUploadRequest.oneofGroups_[0], value);
};
proto.upload.AnalysisFileUploadRequest.prototype.clearDocChunkData = function() {
  return jspb.Message.setOneofField(this, 11, proto.upload.AnalysisFileUploadRequest.oneofGroups_[0], void 0);
};
proto.upload.AnalysisFileUploadRequest.prototype.hasDocChunkData = function() {
  return jspb.Message.getField(this, 11) != null;
};
proto.upload.AnalysisFileUploadRequest.prototype.getAnalysisChunkData = function() {
  return (
    /** @type {!(string|Uint8Array)} */
    jspb.Message.getFieldWithDefault(this, 12, "")
  );
};
proto.upload.AnalysisFileUploadRequest.prototype.getAnalysisChunkData_asB64 = function() {
  return (
    /** @type {string} */
    jspb.Message.bytesAsB64(
      this.getAnalysisChunkData()
    )
  );
};
proto.upload.AnalysisFileUploadRequest.prototype.getAnalysisChunkData_asU8 = function() {
  return (
    /** @type {!Uint8Array} */
    jspb.Message.bytesAsU8(
      this.getAnalysisChunkData()
    )
  );
};
proto.upload.AnalysisFileUploadRequest.prototype.setAnalysisChunkData = function(value) {
  return jspb.Message.setOneofField(this, 12, proto.upload.AnalysisFileUploadRequest.oneofGroups_[0], value);
};
proto.upload.AnalysisFileUploadRequest.prototype.clearAnalysisChunkData = function() {
  return jspb.Message.setOneofField(this, 12, proto.upload.AnalysisFileUploadRequest.oneofGroups_[0], void 0);
};
proto.upload.AnalysisFileUploadRequest.prototype.hasAnalysisChunkData = function() {
  return jspb.Message.getField(this, 12) != null;
};
proto.upload.AnalysisFileUploadRequest.prototype.getEndSignal = function() {
  return (
    /** @type {boolean} */
    jspb.Message.getBooleanFieldWithDefault(this, 13, false)
  );
};
proto.upload.AnalysisFileUploadRequest.prototype.setEndSignal = function(value) {
  return jspb.Message.setOneofField(this, 13, proto.upload.AnalysisFileUploadRequest.oneofGroups_[0], value);
};
proto.upload.AnalysisFileUploadRequest.prototype.clearEndSignal = function() {
  return jspb.Message.setOneofField(this, 13, proto.upload.AnalysisFileUploadRequest.oneofGroups_[0], void 0);
};
proto.upload.AnalysisFileUploadRequest.prototype.hasEndSignal = function() {
  return jspb.Message.getField(this, 13) != null;
};
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.upload.AnalysisInputFileMetaData.prototype.toObject = function(opt_includeInstance) {
    return proto.upload.AnalysisInputFileMetaData.toObject(opt_includeInstance, this);
  };
  proto.upload.AnalysisInputFileMetaData.toObject = function(includeInstance, msg) {
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
proto.upload.AnalysisInputFileMetaData.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.AnalysisInputFileMetaData();
  return proto.upload.AnalysisInputFileMetaData.deserializeBinaryFromReader(msg, reader);
};
proto.upload.AnalysisInputFileMetaData.deserializeBinaryFromReader = function(msg, reader) {
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
proto.upload.AnalysisInputFileMetaData.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.AnalysisInputFileMetaData.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
proto.upload.AnalysisInputFileMetaData.serializeBinaryToWriter = function(message, writer) {
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
proto.upload.AnalysisInputFileMetaData.prototype.getFileName = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 1, "")
  );
};
proto.upload.AnalysisInputFileMetaData.prototype.setFileName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};
proto.upload.AnalysisInputFileMetaData.prototype.getDataType = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 2, "")
  );
};
proto.upload.AnalysisInputFileMetaData.prototype.setDataType = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};
proto.upload.AnalysisInputFileMetaData.prototype.getTypeOfData = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 3, "")
  );
};
proto.upload.AnalysisInputFileMetaData.prototype.setTypeOfData = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};
proto.upload.AnalysisInputFileMetaData.prototype.getDescription = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 4, "")
  );
};
proto.upload.AnalysisInputFileMetaData.prototype.setDescription = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};
proto.upload.AnalysisInputFileMetaData.prototype.getDateCaptured = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 5, "")
  );
};
proto.upload.AnalysisInputFileMetaData.prototype.setDateCaptured = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.upload.AnalysisOutputFileMetaData.prototype.toObject = function(opt_includeInstance) {
    return proto.upload.AnalysisOutputFileMetaData.toObject(opt_includeInstance, this);
  };
  proto.upload.AnalysisOutputFileMetaData.toObject = function(includeInstance, msg) {
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
proto.upload.AnalysisOutputFileMetaData.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.AnalysisOutputFileMetaData();
  return proto.upload.AnalysisOutputFileMetaData.deserializeBinaryFromReader(msg, reader);
};
proto.upload.AnalysisOutputFileMetaData.deserializeBinaryFromReader = function(msg, reader) {
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
proto.upload.AnalysisOutputFileMetaData.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.AnalysisOutputFileMetaData.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
proto.upload.AnalysisOutputFileMetaData.serializeBinaryToWriter = function(message, writer) {
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
proto.upload.AnalysisOutputFileMetaData.prototype.getFileName = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 1, "")
  );
};
proto.upload.AnalysisOutputFileMetaData.prototype.setFileName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};
proto.upload.AnalysisOutputFileMetaData.prototype.getDataType = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 2, "")
  );
};
proto.upload.AnalysisOutputFileMetaData.prototype.setDataType = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};
proto.upload.AnalysisOutputFileMetaData.prototype.getTypeOfData = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 3, "")
  );
};
proto.upload.AnalysisOutputFileMetaData.prototype.setTypeOfData = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};
proto.upload.AnalysisOutputFileMetaData.prototype.getDescription = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 4, "")
  );
};
proto.upload.AnalysisOutputFileMetaData.prototype.setDescription = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};
proto.upload.AnalysisOutputFileMetaData.prototype.getDateCaptured = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 5, "")
  );
};
proto.upload.AnalysisOutputFileMetaData.prototype.setDateCaptured = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.upload.AnalysisDocumentMetaData.prototype.toObject = function(opt_includeInstance) {
    return proto.upload.AnalysisDocumentMetaData.toObject(opt_includeInstance, this);
  };
  proto.upload.AnalysisDocumentMetaData.toObject = function(includeInstance, msg) {
    var f, obj = {
      fileName: jspb.Message.getFieldWithDefault(msg, 1, ""),
      description: jspb.Message.getFieldWithDefault(msg, 2, ""),
      dateCaptured: jspb.Message.getFieldWithDefault(msg, 3, "")
    };
    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }
    return obj;
  };
}
proto.upload.AnalysisDocumentMetaData.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.AnalysisDocumentMetaData();
  return proto.upload.AnalysisDocumentMetaData.deserializeBinaryFromReader(msg, reader);
};
proto.upload.AnalysisDocumentMetaData.deserializeBinaryFromReader = function(msg, reader) {
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
        msg.setDescription(value);
        break;
      case 3:
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
proto.upload.AnalysisDocumentMetaData.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.AnalysisDocumentMetaData.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
proto.upload.AnalysisDocumentMetaData.serializeBinaryToWriter = function(message, writer) {
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
      2,
      f
    );
  }
  f = message.getDateCaptured();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};
proto.upload.AnalysisDocumentMetaData.prototype.getFileName = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 1, "")
  );
};
proto.upload.AnalysisDocumentMetaData.prototype.setFileName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};
proto.upload.AnalysisDocumentMetaData.prototype.getDescription = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 2, "")
  );
};
proto.upload.AnalysisDocumentMetaData.prototype.setDescription = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};
proto.upload.AnalysisDocumentMetaData.prototype.getDateCaptured = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 3, "")
  );
};
proto.upload.AnalysisDocumentMetaData.prototype.setDateCaptured = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.upload.AnalysisMapMetaData.prototype.toObject = function(opt_includeInstance) {
    return proto.upload.AnalysisMapMetaData.toObject(opt_includeInstance, this);
  };
  proto.upload.AnalysisMapMetaData.toObject = function(includeInstance, msg) {
    var f, obj = {
      fileName: jspb.Message.getFieldWithDefault(msg, 1, ""),
      description: jspb.Message.getFieldWithDefault(msg, 2, ""),
      dateCaptured: jspb.Message.getFieldWithDefault(msg, 3, "")
    };
    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }
    return obj;
  };
}
proto.upload.AnalysisMapMetaData.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.AnalysisMapMetaData();
  return proto.upload.AnalysisMapMetaData.deserializeBinaryFromReader(msg, reader);
};
proto.upload.AnalysisMapMetaData.deserializeBinaryFromReader = function(msg, reader) {
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
        msg.setDescription(value);
        break;
      case 3:
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
proto.upload.AnalysisMapMetaData.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.AnalysisMapMetaData.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
proto.upload.AnalysisMapMetaData.serializeBinaryToWriter = function(message, writer) {
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
      2,
      f
    );
  }
  f = message.getDateCaptured();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};
proto.upload.AnalysisMapMetaData.prototype.getFileName = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 1, "")
  );
};
proto.upload.AnalysisMapMetaData.prototype.setFileName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};
proto.upload.AnalysisMapMetaData.prototype.getDescription = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 2, "")
  );
};
proto.upload.AnalysisMapMetaData.prototype.setDescription = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};
proto.upload.AnalysisMapMetaData.prototype.getDateCaptured = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 3, "")
  );
};
proto.upload.AnalysisMapMetaData.prototype.setDateCaptured = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.upload.AnalysisAnalysisAssetMetaData.prototype.toObject = function(opt_includeInstance) {
    return proto.upload.AnalysisAnalysisAssetMetaData.toObject(opt_includeInstance, this);
  };
  proto.upload.AnalysisAnalysisAssetMetaData.toObject = function(includeInstance, msg) {
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
proto.upload.AnalysisAnalysisAssetMetaData.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.AnalysisAnalysisAssetMetaData();
  return proto.upload.AnalysisAnalysisAssetMetaData.deserializeBinaryFromReader(msg, reader);
};
proto.upload.AnalysisAnalysisAssetMetaData.deserializeBinaryFromReader = function(msg, reader) {
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
proto.upload.AnalysisAnalysisAssetMetaData.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.AnalysisAnalysisAssetMetaData.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
proto.upload.AnalysisAnalysisAssetMetaData.serializeBinaryToWriter = function(message, writer) {
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
proto.upload.AnalysisAnalysisAssetMetaData.prototype.getFileName = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 1, "")
  );
};
proto.upload.AnalysisAnalysisAssetMetaData.prototype.setFileName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};
proto.upload.AnalysisAnalysisAssetMetaData.prototype.getDescription = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 4, "")
  );
};
proto.upload.AnalysisAnalysisAssetMetaData.prototype.setDescription = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};
proto.upload.AnalysisAnalysisAssetMetaData.prototype.getDateCaptured = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 5, "")
  );
};
proto.upload.AnalysisAnalysisAssetMetaData.prototype.setDateCaptured = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.upload.AnalysisFileUploadResponse.prototype.toObject = function(opt_includeInstance) {
    return proto.upload.AnalysisFileUploadResponse.toObject(opt_includeInstance, this);
  };
  proto.upload.AnalysisFileUploadResponse.toObject = function(includeInstance, msg) {
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
proto.upload.AnalysisFileUploadResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.AnalysisFileUploadResponse();
  return proto.upload.AnalysisFileUploadResponse.deserializeBinaryFromReader(msg, reader);
};
proto.upload.AnalysisFileUploadResponse.deserializeBinaryFromReader = function(msg, reader) {
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
proto.upload.AnalysisFileUploadResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.AnalysisFileUploadResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
proto.upload.AnalysisFileUploadResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.upload.AnalysisFileUploadResponse.prototype.getSuccess = function() {
  return (
    /** @type {boolean} */
    jspb.Message.getBooleanFieldWithDefault(this, 1, false)
  );
};
proto.upload.AnalysisFileUploadResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};
proto.upload.AnalysisFileUploadResponse.prototype.getMessage = function() {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 2, "")
  );
};
proto.upload.AnalysisFileUploadResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};
proto.upload.AnalysisFileUploadResponse.prototype.getChunkNumber = function() {
  return (
    /** @type {number} */
    jspb.Message.getFieldWithDefault(this, 3, 0)
  );
};
proto.upload.AnalysisFileUploadResponse.prototype.setChunkNumber = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};
export const { AnalysisFileUploadRequest, AnalysisInputFileMetaData,AnalysisOutputFileMetaData,AnalysisAnalysisAssetMetaData,AnalysisDocumentMetaData,AnalysisMapMetaData, AnalysisFileUploadResponse } = proto.upload;
