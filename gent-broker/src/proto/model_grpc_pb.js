// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var model_pb = require('./model_pb.js');

function serialize_Process(arg) {
  if (!(arg instanceof model_pb.Process)) {
    throw new Error('Expected argument of type Process');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_Process(buffer_arg) {
  return model_pb.Process.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_WorkerIn(arg) {
  if (!(arg instanceof model_pb.WorkerIn)) {
    throw new Error('Expected argument of type WorkerIn');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_WorkerIn(buffer_arg) {
  return model_pb.WorkerIn.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_WorkerOut(arg) {
  if (!(arg instanceof model_pb.WorkerOut)) {
    throw new Error('Expected argument of type WorkerOut');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_WorkerOut(buffer_arg) {
  return model_pb.WorkerOut.deserializeBinary(new Uint8Array(buffer_arg));
}


var BrokerService = exports.BrokerService = {
  worker: {
    path: '/Broker/worker',
    requestStream: true,
    responseStream: true,
    requestType: model_pb.WorkerIn,
    responseType: model_pb.WorkerOut,
    requestSerialize: serialize_WorkerIn,
    requestDeserialize: deserialize_WorkerIn,
    responseSerialize: serialize_WorkerOut,
    responseDeserialize: deserialize_WorkerOut,
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
};

exports.BrokerClient = grpc.makeGenericClientConstructor(BrokerService);
