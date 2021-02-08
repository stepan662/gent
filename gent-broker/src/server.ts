import * as grpc from '@grpc/grpc-js'
import { ISongsServer, SongsService } from './proto/songs_grpc_pb'
import SongsServer from './server/index'

async function main() {
  const server = new grpc.Server()
  // @ts-ignore
  server.addService<ISongsServer>(SongsService, new SongsServer())

  server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
    server.start()
    console.log(`server started on port ${port}`)
  })
}

main()
