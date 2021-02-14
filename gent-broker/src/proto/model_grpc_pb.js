// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var model_pb = require('./model_pb.js');

function serialize_WorkerMessage(arg) {
  if (!(arg instanceof model_pb.WorkerMessage)) {
    throw new Error('Expected argument of type WorkerMessage');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_WorkerMessage(buffer_arg) {
  return model_pb.WorkerMessage.deserializeBinary(new Uint8Array(buffer_arg));
}


var BrokerService = exports.BrokerService = {
  worker: {
    path: '/Broker/Worker',
    requestStream: true,
    responseStream: true,
    requestType: model_pb.WorkerMessage,
    responseType: model_pb.WorkerMessage,
    requestSerialize: serialize_WorkerMessage,
    requestDeserialize: deserialize_WorkerMessage,
    responseSerialize: serialize_WorkerMessage,
    responseDeserialize: deserialize_WorkerMessage,
  },
};

exports.BrokerClient = grpc.makeGenericClientConstructor(BrokerService);
