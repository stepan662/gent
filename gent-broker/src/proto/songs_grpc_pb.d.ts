// GENERATED CODE -- DO NOT EDIT!

// package: songs
// file: songs.proto

import * as songs_pb from "./songs_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import * as grpc from "@grpc/grpc-js";

interface ISongsService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  getSong: grpc.MethodDefinition<google_protobuf_empty_pb.Empty, songs_pb.Song>;
  addSongs: grpc.MethodDefinition<songs_pb.Song, google_protobuf_empty_pb.Empty>;
  getChat: grpc.MethodDefinition<songs_pb.Song, songs_pb.Comment>;
  liveChat: grpc.MethodDefinition<songs_pb.Comment, songs_pb.Comment>;
}

export const SongsService: ISongsService;

export interface ISongsServer extends grpc.UntypedServiceImplementation {
  getSong: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, songs_pb.Song>;
  addSongs: grpc.handleClientStreamingCall<songs_pb.Song, google_protobuf_empty_pb.Empty>;
  getChat: grpc.handleServerStreamingCall<songs_pb.Song, songs_pb.Comment>;
  liveChat: grpc.handleBidiStreamingCall<songs_pb.Comment, songs_pb.Comment>;
}

export class SongsClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  getSong(argument: google_protobuf_empty_pb.Empty, callback: grpc.requestCallback<songs_pb.Song>): grpc.ClientUnaryCall;
  getSong(argument: google_protobuf_empty_pb.Empty, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<songs_pb.Song>): grpc.ClientUnaryCall;
  getSong(argument: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<songs_pb.Song>): grpc.ClientUnaryCall;
  addSongs(callback: grpc.requestCallback<google_protobuf_empty_pb.Empty>): grpc.ClientWritableStream<songs_pb.Song>;
  addSongs(metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<google_protobuf_empty_pb.Empty>): grpc.ClientWritableStream<songs_pb.Song>;
  addSongs(metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<google_protobuf_empty_pb.Empty>): grpc.ClientWritableStream<songs_pb.Song>;
  getChat(argument: songs_pb.Song, metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null): grpc.ClientReadableStream<songs_pb.Comment>;
  getChat(argument: songs_pb.Song, metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null): grpc.ClientReadableStream<songs_pb.Comment>;
  liveChat(metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null): grpc.ClientDuplexStream<songs_pb.Comment, songs_pb.Comment>;
  liveChat(metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null): grpc.ClientDuplexStream<songs_pb.Comment, songs_pb.Comment>;
}
