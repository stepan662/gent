// GENERATED CODE -- DO NOT EDIT!

// package: 
// file: model.proto

import * as model_pb from "./model_pb";
import * as grpc from "@grpc/grpc-js";

interface IBrokerService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  worker: grpc.MethodDefinition<model_pb.WorkerIn, model_pb.WorkerOut>;
  create_process: grpc.MethodDefinition<model_pb.Process, model_pb.Process>;
  step_result: grpc.MethodDefinition<model_pb.Process, model_pb.Process>;
}

export const BrokerService: IBrokerService;

export interface IBrokerServer extends grpc.UntypedServiceImplementation {
  worker: grpc.handleBidiStreamingCall<model_pb.WorkerIn, model_pb.WorkerOut>;
  create_process: grpc.handleUnaryCall<model_pb.Process, model_pb.Process>;
  step_result: grpc.handleUnaryCall<model_pb.Process, model_pb.Process>;
}

export class BrokerClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  worker(metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null): grpc.ClientDuplexStream<model_pb.WorkerIn, model_pb.WorkerOut>;
  worker(metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null): grpc.ClientDuplexStream<model_pb.WorkerIn, model_pb.WorkerOut>;
  create_process(argument: model_pb.Process, callback: grpc.requestCallback<model_pb.Process>): grpc.ClientUnaryCall;
  create_process(argument: model_pb.Process, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<model_pb.Process>): grpc.ClientUnaryCall;
  create_process(argument: model_pb.Process, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<model_pb.Process>): grpc.ClientUnaryCall;
  step_result(argument: model_pb.Process, callback: grpc.requestCallback<model_pb.Process>): grpc.ClientUnaryCall;
  step_result(argument: model_pb.Process, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<model_pb.Process>): grpc.ClientUnaryCall;
  step_result(argument: model_pb.Process, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<model_pb.Process>): grpc.ClientUnaryCall;
}
