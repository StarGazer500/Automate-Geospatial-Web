// source: file_upload1.proto
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

goog.exportSymbol('proto.upload.DocumentMetaData', null, global);
goog.exportSymbol('proto.upload.DocumentUploadRequest', null, global);
goog.exportSymbol('proto.upload.DocumentUploadRequest.DataCase', null, global);
goog.exportSymbol('proto.upload.DocumentUploadResponse', null, global);
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
proto.upload.DocumentUploadRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.upload.DocumentUploadRequest.oneofGroups_);
};
goog.inherits(proto.upload.DocumentUploadRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.upload.DocumentUploadRequest.displayName = 'proto.upload.DocumentUploadRequest';
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
proto.upload.DocumentMetaData = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.upload.DocumentMetaData, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.upload.DocumentMetaData.displayName = 'proto.upload.DocumentMetaData';
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
proto.upload.DocumentUploadResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.upload.DocumentUploadResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.upload.DocumentUploadResponse.displayName = 'proto.upload.DocumentUploadResponse';
}

/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.upload.DocumentUploadRequest.oneofGroups_ = [[1,2,3]];

/**
 * @enum {number}
 */
proto.upload.DocumentUploadRequest.DataCase = {
  DATA_NOT_SET: 0,
  META_DATA: 1,
  CHUNK_DATA: 2,
  END_SIGNAL: 3
};

/**
 * @return {proto.upload.DocumentUploadRequest.DataCase}
 */
proto.upload.DocumentUploadRequest.prototype.getDataCase = function() {
  return /** @type {proto.upload.DocumentUploadRequest.DataCase} */(jspb.Message.computeOneofCase(this, proto.upload.DocumentUploadRequest.oneofGroups_[0]));
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
proto.upload.DocumentUploadRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.upload.DocumentUploadRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.upload.DocumentUploadRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.upload.DocumentUploadRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
metaData: (f = msg.getMetaData()) && proto.upload.DocumentMetaData.toObject(includeInstance, f),
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
 * @return {!proto.upload.DocumentUploadRequest}
 */
proto.upload.DocumentUploadRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.DocumentUploadRequest;
  return proto.upload.DocumentUploadRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.upload.DocumentUploadRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.upload.DocumentUploadRequest}
 */
proto.upload.DocumentUploadRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.upload.DocumentMetaData;
      reader.readMessage(value,proto.upload.DocumentMetaData.deserializeBinaryFromReader);
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
proto.upload.DocumentUploadRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.DocumentUploadRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.upload.DocumentUploadRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.upload.DocumentUploadRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getMetaData();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.upload.DocumentMetaData.serializeBinaryToWriter
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
 * optional DocumentMetaData meta_data = 1;
 * @return {?proto.upload.DocumentMetaData}
 */
proto.upload.DocumentUploadRequest.prototype.getMetaData = function() {
  return /** @type{?proto.upload.DocumentMetaData} */ (
    jspb.Message.getWrapperField(this, proto.upload.DocumentMetaData, 1));
};


/**
 * @param {?proto.upload.DocumentMetaData|undefined} value
 * @return {!proto.upload.DocumentUploadRequest} returns this
*/
proto.upload.DocumentUploadRequest.prototype.setMetaData = function(value) {
  return jspb.Message.setOneofWrapperField(this, 1, proto.upload.DocumentUploadRequest.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.upload.DocumentUploadRequest} returns this
 */
proto.upload.DocumentUploadRequest.prototype.clearMetaData = function() {
  return this.setMetaData(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.upload.DocumentUploadRequest.prototype.hasMetaData = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional bytes chunk_data = 2;
 * @return {!(string|Uint8Array)}
 */
proto.upload.DocumentUploadRequest.prototype.getChunkData = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes chunk_data = 2;
 * This is a type-conversion wrapper around `getChunkData()`
 * @return {string}
 */
proto.upload.DocumentUploadRequest.prototype.getChunkData_asB64 = function() {
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
proto.upload.DocumentUploadRequest.prototype.getChunkData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getChunkData()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.upload.DocumentUploadRequest} returns this
 */
proto.upload.DocumentUploadRequest.prototype.setChunkData = function(value) {
  return jspb.Message.setOneofField(this, 2, proto.upload.DocumentUploadRequest.oneofGroups_[0], value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.upload.DocumentUploadRequest} returns this
 */
proto.upload.DocumentUploadRequest.prototype.clearChunkData = function() {
  return jspb.Message.setOneofField(this, 2, proto.upload.DocumentUploadRequest.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.upload.DocumentUploadRequest.prototype.hasChunkData = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional bool end_signal = 3;
 * @return {boolean}
 */
proto.upload.DocumentUploadRequest.prototype.getEndSignal = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
};


/**
 * @param {boolean} value
 * @return {!proto.upload.DocumentUploadRequest} returns this
 */
proto.upload.DocumentUploadRequest.prototype.setEndSignal = function(value) {
  return jspb.Message.setOneofField(this, 3, proto.upload.DocumentUploadRequest.oneofGroups_[0], value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.upload.DocumentUploadRequest} returns this
 */
proto.upload.DocumentUploadRequest.prototype.clearEndSignal = function() {
  return jspb.Message.setOneofField(this, 3, proto.upload.DocumentUploadRequest.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.upload.DocumentUploadRequest.prototype.hasEndSignal = function() {
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
proto.upload.DocumentMetaData.prototype.toObject = function(opt_includeInstance) {
  return proto.upload.DocumentMetaData.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.upload.DocumentMetaData} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
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


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.upload.DocumentMetaData}
 */
proto.upload.DocumentMetaData.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.DocumentMetaData;
  return proto.upload.DocumentMetaData.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.upload.DocumentMetaData} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.upload.DocumentMetaData}
 */
proto.upload.DocumentMetaData.deserializeBinaryFromReader = function(msg, reader) {
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
proto.upload.DocumentMetaData.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.DocumentMetaData.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.upload.DocumentMetaData} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.upload.DocumentMetaData.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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


/**
 * optional string file_name = 1;
 * @return {string}
 */
proto.upload.DocumentMetaData.prototype.getFileName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.upload.DocumentMetaData} returns this
 */
proto.upload.DocumentMetaData.prototype.setFileName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string description = 4;
 * @return {string}
 */
proto.upload.DocumentMetaData.prototype.getDescription = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.upload.DocumentMetaData} returns this
 */
proto.upload.DocumentMetaData.prototype.setDescription = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string date_captured = 5;
 * @return {string}
 */
proto.upload.DocumentMetaData.prototype.getDateCaptured = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.upload.DocumentMetaData} returns this
 */
proto.upload.DocumentMetaData.prototype.setDateCaptured = function(value) {
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
proto.upload.DocumentUploadResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.upload.DocumentUploadResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.upload.DocumentUploadResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
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


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.upload.DocumentUploadResponse}
 */
proto.upload.DocumentUploadResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.upload.DocumentUploadResponse;
  return proto.upload.DocumentUploadResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.upload.DocumentUploadResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.upload.DocumentUploadResponse}
 */
proto.upload.DocumentUploadResponse.deserializeBinaryFromReader = function(msg, reader) {
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
proto.upload.DocumentUploadResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.upload.DocumentUploadResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.upload.DocumentUploadResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.upload.DocumentUploadResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.upload.DocumentUploadResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.upload.DocumentUploadResponse} returns this
 */
proto.upload.DocumentUploadResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string message = 2;
 * @return {string}
 */
proto.upload.DocumentUploadResponse.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.upload.DocumentUploadResponse} returns this
 */
proto.upload.DocumentUploadResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional int32 chunk_number = 3;
 * @return {number}
 */
proto.upload.DocumentUploadResponse.prototype.getChunkNumber = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.upload.DocumentUploadResponse} returns this
 */
proto.upload.DocumentUploadResponse.prototype.setChunkNumber = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


goog.object.extend(exports, proto.upload);
