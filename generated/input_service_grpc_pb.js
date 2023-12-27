// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// input.proto
'use strict';
var grpc = require('@grpc/grpc-js');
var input_service_pb = require('./input_service_pb.js');

function serialize_StartRequest(arg) {
  if (!(arg instanceof input_service_pb.StartRequest)) {
    throw new Error('Expected argument of type StartRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_StartRequest(buffer_arg) {
  return input_service_pb.StartRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_StatusResponse(arg) {
  if (!(arg instanceof input_service_pb.StatusResponse)) {
    throw new Error('Expected argument of type StatusResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_StatusResponse(buffer_arg) {
  return input_service_pb.StatusResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_StopRequest(arg) {
  if (!(arg instanceof input_service_pb.StopRequest)) {
    throw new Error('Expected argument of type StopRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_StopRequest(buffer_arg) {
  return input_service_pb.StopRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var InputService = exports.InputService = {
  startRecording: {
    path: '/Input/StartRecording',
    requestStream: false,
    responseStream: false,
    requestType: input_service_pb.StartRequest,
    responseType: input_service_pb.StatusResponse,
    requestSerialize: serialize_StartRequest,
    requestDeserialize: deserialize_StartRequest,
    responseSerialize: serialize_StatusResponse,
    responseDeserialize: deserialize_StatusResponse,
  },
  stopRecording: {
    path: '/Input/StopRecording',
    requestStream: false,
    responseStream: false,
    requestType: input_service_pb.StopRequest,
    responseType: input_service_pb.StatusResponse,
    requestSerialize: serialize_StopRequest,
    requestDeserialize: deserialize_StopRequest,
    responseSerialize: serialize_StatusResponse,
    responseDeserialize: deserialize_StatusResponse,
  },
};

exports.InputClient = grpc.makeGenericClientConstructor(InputService);
