// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var model_pb = require('./model_pb.js');

function serialize_Empty(arg) {
  if (!(arg instanceof model_pb.Empty)) {
    throw new Error('Expected argument of type Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_Empty(buffer_arg) {
  return model_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_Process(arg) {
  if (!(arg instanceof model_pb.Process)) {
    throw new Error('Expected argument of type Process');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_Process(buffer_arg) {
  return model_pb.Process.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ProcessId(arg) {
  if (!(arg instanceof model_pb.ProcessId)) {
    throw new Error('Expected argument of type ProcessId');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ProcessId(buffer_arg) {
  return model_pb.ProcessId.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_Processes(arg) {
  if (!(arg instanceof model_pb.Processes)) {
    throw new Error('Expected argument of type Processes');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_Processes(buffer_arg) {
  return model_pb.Processes.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_Worker(arg) {
  if (!(arg instanceof model_pb.Worker)) {
    throw new Error('Expected argument of type Worker');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_Worker(buffer_arg) {
  return model_pb.Worker.deserializeBinary(new Uint8Array(buffer_arg));
}


var BrokerService = exports.BrokerService = {
  worker: {
    path: '/Broker/worker',
    requestStream: true,
    responseStream: true,
    requestType: model_pb.Worker,
    responseType: model_pb.Process,
    requestSerialize: serialize_Worker,
    requestDeserialize: deserialize_Worker,
    responseSerialize: serialize_Process,
    responseDeserialize: deserialize_Process,
  },
  create_process: {
    path: '/Broker/create_process',
    requestStream: false,
    responseStream: false,
    requestType: model_pb.Process,
    responseType: model_pb.Process,
    requestSerialize: serialize_Process,
    requestDeserialize: deserialize_Process,
    responseSerialize: serialize_Process,
    responseDeserialize: deserialize_Process,
  },
  step_result: {
    path: '/Broker/step_result',
    requestStream: false,
    responseStream: false,
    requestType: model_pb.Process,
    responseType: model_pb.Process,
    requestSerialize: serialize_Process,
    requestDeserialize: deserialize_Process,
    responseSerialize: serialize_Process,
    responseDeserialize: deserialize_Process,
  },
  get_process: {
    path: '/Broker/get_process',
    requestStream: false,
    responseStream: false,
    requestType: model_pb.ProcessId,
    responseType: model_pb.Process,
    requestSerialize: serialize_ProcessId,
    requestDeserialize: deserialize_ProcessId,
    responseSerialize: serialize_Process,
    responseDeserialize: deserialize_Process,
  },
  get_processes: {
    path: '/Broker/get_processes',
    requestStream: false,
    responseStream: false,
    requestType: model_pb.Empty,
    responseType: model_pb.Processes,
    requestSerialize: serialize_Empty,
    requestDeserialize: deserialize_Empty,
    responseSerialize: serialize_Processes,
    responseDeserialize: deserialize_Processes,
  },
};

exports.BrokerClient = grpc.makeGenericClientConstructor(BrokerService);
