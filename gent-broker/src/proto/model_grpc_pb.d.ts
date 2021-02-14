// GENERATED CODE -- DO NOT EDIT!

// package: 
// file: model.proto

import * as model_pb from "./model_pb";
import * as grpc from "@grpc/grpc-js";

interface IBrokerService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  worker: grpc.MethodDefinition<model_pb.WorkerMessage, model_pb.WorkerMessage>;
}

export const BrokerService: IBrokerService;

export interface IBrokerServer extends grpc.UntypedServiceImplementation {
  worker: grpc.handleBidiStreamingCall<model_pb.WorkerMessage, model_pb.WorkerMessage>;
}

export class BrokerClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  worker(metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null): grpc.ClientDuplexStream<model_pb.WorkerMessage, model_pb.WorkerMessage>;
  worker(metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null): grpc.ClientDuplexStream<model_pb.WorkerMessage, model_pb.WorkerMessage>;
}
