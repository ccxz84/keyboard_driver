// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// input.proto
'use strict';
var grpc = require('@grpc/grpc-js');
var input_service_pb = require('./input_service_pb.js');

function serialize_ComplexReplayRequest(arg) {
  if (!(arg instanceof input_service_pb.ComplexReplayRequest)) {
    throw new Error('Expected argument of type ComplexReplayRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ComplexReplayRequest(buffer_arg) {
  return input_service_pb.ComplexReplayRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DeleteMacrosRequest(arg) {
  if (!(arg instanceof input_service_pb.DeleteMacrosRequest)) {
    throw new Error('Expected argument of type DeleteMacrosRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DeleteMacrosRequest(buffer_arg) {
  return input_service_pb.DeleteMacrosRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GetMacroDetailRequest(arg) {
  if (!(arg instanceof input_service_pb.GetMacroDetailRequest)) {
    throw new Error('Expected argument of type GetMacroDetailRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetMacroDetailRequest(buffer_arg) {
  return input_service_pb.GetMacroDetailRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GetMacroDetailResponse(arg) {
  if (!(arg instanceof input_service_pb.GetMacroDetailResponse)) {
    throw new Error('Expected argument of type GetMacroDetailResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetMacroDetailResponse(buffer_arg) {
  return input_service_pb.GetMacroDetailResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ListRequest(arg) {
  if (!(arg instanceof input_service_pb.ListRequest)) {
    throw new Error('Expected argument of type ListRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ListRequest(buffer_arg) {
  return input_service_pb.ListRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_MacroEvent(arg) {
  if (!(arg instanceof input_service_pb.MacroEvent)) {
    throw new Error('Expected argument of type MacroEvent');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_MacroEvent(buffer_arg) {
  return input_service_pb.MacroEvent.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ReplayRequest(arg) {
  if (!(arg instanceof input_service_pb.ReplayRequest)) {
    throw new Error('Expected argument of type ReplayRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ReplayRequest(buffer_arg) {
  return input_service_pb.ReplayRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_SaveFilesResponse(arg) {
  if (!(arg instanceof input_service_pb.SaveFilesResponse)) {
    throw new Error('Expected argument of type SaveFilesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_SaveFilesResponse(buffer_arg) {
  return input_service_pb.SaveFilesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_SaveMacroRequest(arg) {
  if (!(arg instanceof input_service_pb.SaveMacroRequest)) {
    throw new Error('Expected argument of type SaveMacroRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_SaveMacroRequest(buffer_arg) {
  return input_service_pb.SaveMacroRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_SaveMacroResponse(arg) {
  if (!(arg instanceof input_service_pb.SaveMacroResponse)) {
    throw new Error('Expected argument of type SaveMacroResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_SaveMacroResponse(buffer_arg) {
  return input_service_pb.SaveMacroResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

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

function serialize_StopReplayRequest(arg) {
  if (!(arg instanceof input_service_pb.StopReplayRequest)) {
    throw new Error('Expected argument of type StopReplayRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_StopReplayRequest(buffer_arg) {
  return input_service_pb.StopReplayRequest.deserializeBinary(new Uint8Array(buffer_arg));
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
  startReplay: {
    path: '/Input/StartReplay',
    requestStream: false,
    responseStream: false,
    requestType: input_service_pb.ReplayRequest,
    responseType: input_service_pb.StatusResponse,
    requestSerialize: serialize_ReplayRequest,
    requestDeserialize: deserialize_ReplayRequest,
    responseSerialize: serialize_StatusResponse,
    responseDeserialize: deserialize_StatusResponse,
  },
  getMacroDetail: {
    path: '/Input/GetMacroDetail',
    requestStream: false,
    responseStream: false,
    requestType: input_service_pb.GetMacroDetailRequest,
    responseType: input_service_pb.GetMacroDetailResponse,
    requestSerialize: serialize_GetMacroDetailRequest,
    requestDeserialize: deserialize_GetMacroDetailRequest,
    responseSerialize: serialize_GetMacroDetailResponse,
    responseDeserialize: deserialize_GetMacroDetailResponse,
  },
  replayMacroDebug: {
    path: '/Input/ReplayMacroDebug',
    requestStream: false,
    responseStream: true,
    requestType: input_service_pb.ReplayRequest,
    responseType: input_service_pb.MacroEvent,
    requestSerialize: serialize_ReplayRequest,
    requestDeserialize: deserialize_ReplayRequest,
    responseSerialize: serialize_MacroEvent,
    responseDeserialize: deserialize_MacroEvent,
  },
  stopReplay: {
    path: '/Input/StopReplay',
    requestStream: false,
    responseStream: false,
    requestType: input_service_pb.StopReplayRequest,
    responseType: input_service_pb.StatusResponse,
    requestSerialize: serialize_StopReplayRequest,
    requestDeserialize: deserialize_StopReplayRequest,
    responseSerialize: serialize_StatusResponse,
    responseDeserialize: deserialize_StatusResponse,
  },
  listSaveFiles: {
    path: '/Input/ListSaveFiles',
    requestStream: false,
    responseStream: false,
    requestType: input_service_pb.ListRequest,
    responseType: input_service_pb.SaveFilesResponse,
    requestSerialize: serialize_ListRequest,
    requestDeserialize: deserialize_ListRequest,
    responseSerialize: serialize_SaveFilesResponse,
    responseDeserialize: deserialize_SaveFilesResponse,
  },
  saveMacro: {
    path: '/Input/SaveMacro',
    requestStream: false,
    responseStream: false,
    requestType: input_service_pb.SaveMacroRequest,
    responseType: input_service_pb.SaveMacroResponse,
    requestSerialize: serialize_SaveMacroRequest,
    requestDeserialize: deserialize_SaveMacroRequest,
    responseSerialize: serialize_SaveMacroResponse,
    responseDeserialize: deserialize_SaveMacroResponse,
  },
  deleteMacros: {
    path: '/Input/DeleteMacros',
    requestStream: false,
    responseStream: false,
    requestType: input_service_pb.DeleteMacrosRequest,
    responseType: input_service_pb.StatusResponse,
    requestSerialize: serialize_DeleteMacrosRequest,
    requestDeserialize: deserialize_DeleteMacrosRequest,
    responseSerialize: serialize_StatusResponse,
    responseDeserialize: deserialize_StatusResponse,
  },
  startComplexReplay: {
    path: '/Input/StartComplexReplay',
    requestStream: false,
    responseStream: false,
    requestType: input_service_pb.ComplexReplayRequest,
    responseType: input_service_pb.StatusResponse,
    requestSerialize: serialize_ComplexReplayRequest,
    requestDeserialize: deserialize_ComplexReplayRequest,
    responseSerialize: serialize_StatusResponse,
    responseDeserialize: deserialize_StatusResponse,
  },
};

exports.InputClient = grpc.makeGenericClientConstructor(InputService);
