PROTOC_GEN_TS_PATH := $(shell which protoc-gen-ts)
PROTOC_GEN_GRPC_WEB_PATH := $(shell which protoc-gen-grpc-web)

createnpmproto:
	protoc \
	  --plugin=protoc-gen-ts=$(PROTOC_GEN_TS_PATH) \
	  --plugin=protoc-gen-grpc-web=$(PROTOC_GEN_GRPC_WEB_PATH) \
	  --proto_path=./src/rainforestbuilder/dataset/grpc_setup/proto \
	  --js_out=import_style=commonjs,binary:./src/rainforestbuilder/dataset/grpc_setup/generated \
	  --grpc-web_out=import_style=typescript,mode=grpcwebtext:./src/rainforestbuilder/dataset/grpc_setup/generated \
	  ./src/rainforestbuilder/dataset/grpc_setup/proto/file_upload.proto
	npx esbuild ./src/rainforestbuilder/dataset/grpc_setup/generated/file_upload_pb.js \
	  --format=esm \
	  --outfile=./src/rainforestbuilder/dataset/grpc_setup/generated/file_upload_pb.esm.js
	sed -i 's/var jspb = require("google-protobuf");/import * as jspb from "google-protobuf";/' \
	  ./src/rainforestbuilder/dataset/grpc_setup/generated/file_upload_pb.esm.js
	sed -i 's/goog.object.extend(exports, proto.upload);/export const { FileUploadRequest, FileMetaData, FileUploadResponse } = proto.upload;/' \
	  ./src/rainforestbuilder/dataset/grpc_setup/generated/file_upload_pb.esm.js
	rm -f ./src/rainforestbuilder/dataset/grpc_setup/generated/file_upload_pb.js

createnpmproto1:
	protoc \
	  --proto_path=./src/rainforestbuilder/dataset/grpc_setup/proto \
	  --js_out=import_style=commonjs,binary:./src/rainforestbuilder/dataset/grpc_setup/generated \
	  ./src/rainforestbuilder/dataset/grpc_setup/proto/file_upload1.proto
	npx esbuild ./src/rainforestbuilder/dataset/grpc_setup/generated/file_upload1_pb.js \
	  --format=esm \
	  --outfile=./src/rainforestbuilder/dataset/grpc_setup/generated/file_upload1_pb.esm.js
	sed -i 's/var jspb = require("google-protobuf");/import * as jspb from "google-protobuf";/' \
	  ./src/rainforestbuilder/dataset/grpc_setup/generated/file_upload1_pb.esm.js
	sed -i 's/goog.object.extend(exports, proto.upload);/export const { FileUploadRequest, FileMetaData, FileUploadResponse } = proto.upload;/' \
	  ./src/rainforestbuilder/dataset/grpc_setup/generated/file_upload1_pb.esm.js
	rm -f ./src/rainforestbuilder/dataset/grpc_setup/generated/file1_upload_pb.js


install_protoc:
	@echo "Installing Protocol Buffers Compiler (protoc)..."
	# macOS
	
	if command -v apt-get &>/dev/null; then \
		sudo apt update && sudo apt install protobuf-compiler; \
	else \
		echo "Please manually install protoc from https://github.com/protocolbuffers/protobuf/releases"; \
		exit 1; \
	fi

# Install protoc-gen-js (JavaScript plugin for protoc)
install_protoc_gen_ts:
	@echo "Installing protoc-gen-ts..."
	npm install -g ts-protoc-gen
	

# Install protoc-gen-grpc-web (gRPC-Web plugin for protoc)
install_protoc_gen_grpc_web:
	@echo "Installing protoc-gen-grpc-web..."
	npm install -g protoc-gen-grpc-web
	



# Install required Node.js packages
install_node_packages:
	@echo "Installing Node.js packages (grpc-web, google-protobuf)..."
	npm install grpc-web google-protobuf

# Default target: Install everything
install: install_protoc install_protoc_gen_ts install_protoc_gen_grpc_web  install_node_packages
	@echo "All dependencies installed successfully!"

rundev:
	npm run dev

.PHONY: install_protoc install_protoc_gen_js install_protoc_gen_grpc_web  install_node_packages install