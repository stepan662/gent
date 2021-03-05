// GENERATED CODE -- DO NOT EDIT!

// package: 
// file: model.proto

import * as model_pb from "./model_pb";
import * as grpc from "@grpc/grpc-js";

interface IBrokerService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  worker: grpc.MethodDefinition<model_pb.Worker, model_pb.Process>;
  create_process: grpc.MethodDefinition<model_pb.Process, model_pb.Process>;
  step_result: grpc.MethodDefinition<model_pb.Process, model_pb.Process>;
  get_process: grpc.MethodDefinition<model_pb.ProcessId, model_pb.Process>;
  get_processes: grpc.MethodDefinition<model_pb.Empty, model_pb.Processes>;
}

export const BrokerService: IBrokerService;

export interface IBrokerServer extends grpc.UntypedServiceImplementation {
  worker: grpc.handleBidiStreamingCall<model_pb.Worker, model_pb.Process>;
  create_process: grpc.handleUnaryCall<model_pb.Process, model_pb.Process>;
  step_result: grpc.handleUnaryCall<model_pb.Process, model_pb.Process>;
  get_process: grpc.handleUnaryCall<model_pb.ProcessId, model_pb.Process>;
  get_processes: grpc.handleUnaryCall<model_pb.Empty, model_pb.Processes>;
}

export class BrokerClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  worker(metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null): grpc.ClientDuplexStream<model_pb.Worker, model_pb.Process>;
  worker(metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null): grpc.ClientDuplexStream<model_pb.Worker, model_pb.Process>;
  create_process(argument: model_pb.Process, callback: grpc.requestCallback<model_pb.Process>): grpc.ClientUnaryCall;
  create_process(argument: model_pb.Process, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<model_pb.Process>): grpc.ClientUnaryCall;
  create_process(argument: model_pb.Process, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<model_pb.Process>): grpc.ClientUnaryCall;
  step_result(argument: model_pb.Process, callback: grpc.requestCallback<model_pb.Process>): grpc.ClientUnaryCall;
  step_result(argument: model_pb.Process, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<model_pb.Process>): grpc.ClientUnaryCall;
  step_result(argument: model_pb.Process, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<model_pb.Process>): grpc.ClientUnaryCall;
  get_process(argument: model_pb.ProcessId, callback: grpc.requestCallback<model_pb.Process>): grpc.ClientUnaryCall;
  get_process(argument: model_pb.ProcessId, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<model_pb.Process>): grpc.ClientUnaryCall;
  get_process(argument: model_pb.ProcessId, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<model_pb.Process>): grpc.ClientUnaryCall;
  get_processes(argument: model_pb.Empty, callback: grpc.requestCallback<model_pb.Processes>): grpc.ClientUnaryCall;
  get_processes(argument: model_pb.Empty, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<model_pb.Processes>): grpc.ClientUnaryCall;
  get_processes(argument: model_pb.Empty, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<model_pb.Processes>): grpc.ClientUnaryCall;
}
