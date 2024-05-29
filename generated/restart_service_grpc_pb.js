// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var restart_service_pb = require('./restart_service_pb.js');

function serialize_RestartRequest(arg) {
  if (!(arg instanceof restart_service_pb.RestartRequest)) {
    throw new Error('Expected argument of type RestartRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RestartRequest(buffer_arg) {
  return restart_service_pb.RestartRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_RestartResponse(arg) {
  if (!(arg instanceof restart_service_pb.RestartResponse)) {
    throw new Error('Expected argument of type RestartResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RestartResponse(buffer_arg) {
  return restart_service_pb.RestartResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_UpdateRequest(arg) {
  if (!(arg instanceof restart_service_pb.UpdateRequest)) {
    throw new Error('Expected argument of type UpdateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_UpdateRequest(buffer_arg) {
  return restart_service_pb.UpdateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_UpdateResponse(arg) {
  if (!(arg instanceof restart_service_pb.UpdateResponse)) {
    throw new Error('Expected argument of type UpdateResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_UpdateResponse(buffer_arg) {
  return restart_service_pb.UpdateResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var RestartService = exports.RestartService = {
  restartProcess: {
    path: '/Restart/RestartProcess',
    requestStream: false,
    responseStream: false,
    requestType: restart_service_pb.RestartRequest,
    responseType: restart_service_pb.RestartResponse,
    requestSerialize: serialize_RestartRequest,
    requestDeserialize: deserialize_RestartRequest,
    responseSerialize: serialize_RestartResponse,
    responseDeserialize: deserialize_RestartResponse,
  },
  requestUpdate: {
    path: '/Restart/RequestUpdate',
    requestStream: false,
    responseStream: true,
    requestType: restart_service_pb.UpdateRequest,
    responseType: restart_service_pb.UpdateResponse,
    requestSerialize: serialize_UpdateRequest,
    requestDeserialize: deserialize_UpdateRequest,
    responseSerialize: serialize_UpdateResponse,
    responseDeserialize: deserialize_UpdateResponse,
  },
};

exports.RestartClient = grpc.makeGenericClientConstructor(RestartService);
