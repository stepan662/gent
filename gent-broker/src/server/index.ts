import * as grpc from '@grpc/grpc-js'
import { sendUnaryData } from '@grpc/grpc-js/build/src/server-call'
import { Empty } from 'google-protobuf/google/protobuf/empty_pb'
import { Song, Comment } from '../proto/songs_pb'
import { ISongsServer, SongsService } from '../proto/songs_grpc_pb'
import getSong from './get-song'
import addSong from './add-song'
import getChat from './get-chat'
import { addComment, registerListener } from './live-chat'

export default class SongsServer implements ISongsServer {
  [name: string]: grpc.UntypedHandleCall
  getSong(call: grpc.ServerUnaryCall<Empty, Song>, callback: sendUnaryData<Song>): void {
    console.log(`${new Date().toISOString()}    getSong`)
    callback(null, getSong())
  }
  addSongs(call: grpc.ServerReadableStream<Song, Empty>, callback: sendUnaryData<Empty>): void {
    console.log(`${new Date().toISOString()}    addSongs`)
    call.on('data', (song: Song) => {
      addSong(song)
    })
    call.on('end', () => callback(null, new Empty()))
  }
  async getChat(call: grpc.ServerWritableStream<Song, Comment>): Promise<void> {
    console.log(`${new Date().toISOString()}    getChat`)
    const song = call.request as Song
    const comments = await getChat(song.getId())
    for (const comment of comments) {
      call.write(comment)
    }
    call.end()
  }
  liveChat(call: grpc.ServerDuplexStream<Comment, Comment>): void {
    console.log(`${new Date().toISOString()}    liveChat`)
    registerListener((comment) => call.write(comment))
    call.on('data', (comment: Comment) => {
      addComment(comment)
    })
    call.on('end', () => call.end())
  }
}
