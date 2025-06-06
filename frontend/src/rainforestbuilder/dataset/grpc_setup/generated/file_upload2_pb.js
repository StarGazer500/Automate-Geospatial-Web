// source: file_upload2.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global =
    (typeof globalThis !== 'undefined' && globalThis) ||
    (typeof window !== 'undefined' && window) ||
    (typeof global !== 'undefined' && global) ||
    (typeof self !== 'undefined' && self) ||
    (function () { return this; }).call(null) ||
    Function('return this')();

goog.exportSymbol('proto.upload.FileMetaData', null, global);
goog.exportSymbol('proto.upload.FileUploadRequest', null, global);
goog.exportSymbol('proto.upload.FileUploadRequest.DataCase', null, global);
goog.exportSymbol('proto.upload.FileUploadResponse', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.upload.FileUploadRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.upload.FileUploadRequest.oneofGroups_);
};
goog.inherits(proto.upload.FileUploadRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.upload.FileUploadRequest.displayName = 'proto.upload.FileUploadRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.upload.FileMetaData = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.upload.FileMetaData, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.upload.FileMetaData.displayName = 'proto.upload.FileMetaData';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.upload.FileUploadResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.upload.FileUploadResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.upload.FileUploadResponse.displayName = 'proto.upload.FileUploadResponse';
}

/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.upload.FileUploadRequest.oneofGroups_ = [[1,2,3]];

/**
 * @enum {number}
 */
proto.upload.FileUploadRequest.DataCase = {
  DATA_NOT_SET: 0,
  META_DATA: 1,
  CHUNK_DATA: 2,
  END_SIGNAL: 3
};

/**
 * @return {proto.upload.FileUploadRequest.DataCase}
 */
proto.upload.FileUploadRequest.prototype.getDataCase = function() {
  return /** @type {proto.upload.FileUploadRequest.DataCase} */(jspb.Message.computeOneofCase(this, proto.upload.FileUploadRequest.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.upload.FileUploadRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.upload.FileUploadRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.upload.FileUploadRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.upload.FileUploadRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
fileName: jspb.Message.getFieldWithDefault(msg, 4, ""),
metaData: (f = msg.getMetaData()) && proto.upload.FileMetaData.toObject(includeInstance, f),
chunkData: msg.getChunkData_asB64(),
endSignal: (f = jspb.Message.getBooleanField(msg, 3)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.upload.FileUploadRequest}
 */
proto.upload.FileUploadRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.FileUploadRequest;
  return proto.upload.FileUploadRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.upload.FileUploadRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.upload.FileUploadRequest}
 */
proto.upload.FileUploadRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setFileName(value);
      break;
    case 1:
      var value = new proto.upload.FileMetaData;
      reader.readMessage(value,proto.upload.FileMetaData.deserializeBinaryFromReader);
      msg.setMetaData(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setChunkData(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setEndSignal(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.upload.FileUploadRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.FileUploadRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.upload.FileUploadRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.upload.FileUploadRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
  f = /** @type {!(string|Uint8Array)} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeBytes(
      2,
      f
    );
  }
  f = /** @type {boolean} */ (jspb.Message.getField(message, 3));
  if (f != null) {
    writer.writeBool(
      3,
      f
    );
  }
};


/**
 * optional string file_name = 4;
 * @return {string}
 */
proto.upload.FileUploadRequest.prototype.getFileName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.upload.FileUploadRequest} returns this
 */
proto.upload.FileUploadRequest.prototype.setFileName = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional FileMetaData meta_data = 1;
 * @return {?proto.upload.FileMetaData}
 */
proto.upload.FileUploadRequest.prototype.getMetaData = function() {
  return /** @type{?proto.upload.FileMetaData} */ (
    jspb.Message.getWrapperField(this, proto.upload.FileMetaData, 1));
};


/**
 * @param {?proto.upload.FileMetaData|undefined} value
 * @return {!proto.upload.FileUploadRequest} returns this
*/
proto.upload.FileUploadRequest.prototype.setMetaData = function(value) {
  return jspb.Message.setOneofWrapperField(this, 1, proto.upload.FileUploadRequest.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.upload.FileUploadRequest} returns this
 */
proto.upload.FileUploadRequest.prototype.clearMetaData = function() {
  return this.setMetaData(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.upload.FileUploadRequest.prototype.hasMetaData = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional bytes chunk_data = 2;
 * @return {!(string|Uint8Array)}
 */
proto.upload.FileUploadRequest.prototype.getChunkData = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes chunk_data = 2;
 * This is a type-conversion wrapper around `getChunkData()`
 * @return {string}
 */
proto.upload.FileUploadRequest.prototype.getChunkData_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getChunkData()));
};


/**
 * optional bytes chunk_data = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getChunkData()`
 * @return {!Uint8Array}
 */
proto.upload.FileUploadRequest.prototype.getChunkData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getChunkData()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.upload.FileUploadRequest} returns this
 */
proto.upload.FileUploadRequest.prototype.setChunkData = function(value) {
  return jspb.Message.setOneofField(this, 2, proto.upload.FileUploadRequest.oneofGroups_[0], value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.upload.FileUploadRequest} returns this
 */
proto.upload.FileUploadRequest.prototype.clearChunkData = function() {
  return jspb.Message.setOneofField(this, 2, proto.upload.FileUploadRequest.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.upload.FileUploadRequest.prototype.hasChunkData = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional bool end_signal = 3;
 * @return {boolean}
 */
proto.upload.FileUploadRequest.prototype.getEndSignal = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
};


/**
 * @param {boolean} value
 * @return {!proto.upload.FileUploadRequest} returns this
 */
proto.upload.FileUploadRequest.prototype.setEndSignal = function(value) {
  return jspb.Message.setOneofField(this, 3, proto.upload.FileUploadRequest.oneofGroups_[0], value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.upload.FileUploadRequest} returns this
 */
proto.upload.FileUploadRequest.prototype.clearEndSignal = function() {
  return jspb.Message.setOneofField(this, 3, proto.upload.FileUploadRequest.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.upload.FileUploadRequest.prototype.hasEndSignal = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.upload.FileMetaData.prototype.toObject = function(opt_includeInstance) {
  return proto.upload.FileMetaData.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.upload.FileMetaData} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
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


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.upload.FileMetaData}
 */
proto.upload.FileMetaData.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.FileMetaData;
  return proto.upload.FileMetaData.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.upload.FileMetaData} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.upload.FileMetaData}
 */
proto.upload.FileMetaData.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setFileName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setDataType(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setTypeOfData(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setDescription(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setDateCaptured(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.upload.FileMetaData.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.FileMetaData.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.upload.FileMetaData} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.upload.FileMetaData.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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


/**
 * optional string file_name = 1;
 * @return {string}
 */
proto.upload.FileMetaData.prototype.getFileName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.upload.FileMetaData} returns this
 */
proto.upload.FileMetaData.prototype.setFileName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string data_type = 2;
 * @return {string}
 */
proto.upload.FileMetaData.prototype.getDataType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.upload.FileMetaData} returns this
 */
proto.upload.FileMetaData.prototype.setDataType = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string type_of_data = 3;
 * @return {string}
 */
proto.upload.FileMetaData.prototype.getTypeOfData = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.upload.FileMetaData} returns this
 */
proto.upload.FileMetaData.prototype.setTypeOfData = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string description = 4;
 * @return {string}
 */
proto.upload.FileMetaData.prototype.getDescription = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.upload.FileMetaData} returns this
 */
proto.upload.FileMetaData.prototype.setDescription = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string date_captured = 5;
 * @return {string}
 */
proto.upload.FileMetaData.prototype.getDateCaptured = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.upload.FileMetaData} returns this
 */
proto.upload.FileMetaData.prototype.setDateCaptured = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.upload.FileUploadResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.upload.FileUploadResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.upload.FileUploadResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
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


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.upload.FileUploadResponse}
 */
proto.upload.FileUploadResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.FileUploadResponse;
  return proto.upload.FileUploadResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.upload.FileUploadResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.upload.FileUploadResponse}
 */
proto.upload.FileUploadResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setMessage(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setChunkNumber(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.upload.FileUploadResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.FileUploadResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.upload.FileUploadResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.upload.FileUploadResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.upload.FileUploadResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.upload.FileUploadResponse} returns this
 */
proto.upload.FileUploadResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string message = 2;
 * @return {string}
 */
proto.upload.FileUploadResponse.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.upload.FileUploadResponse} returns this
 */
proto.upload.FileUploadResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional int32 chunk_number = 3;
 * @return {number}
 */
proto.upload.FileUploadResponse.prototype.getChunkNumber = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.upload.FileUploadResponse} returns this
 */
proto.upload.FileUploadResponse.prototype.setChunkNumber = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


goog.object.extend(exports, proto.upload);
