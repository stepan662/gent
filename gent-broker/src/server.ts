import * as grpc from '@grpc/grpc-js'
import { BrokerService } from './proto/model_grpc_pb'
import { getBrokerServer } from './BrokerServer'
import WorkManager from './WorkManager'

async function main() {
  const workManager = new WorkManager()
  const server = new grpc.Server()
  server.addService(BrokerService, getBrokerServer(workManager))

  server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error(err)
    } else {
      server.start()
      console.log(`server started on port ${port}`)
    }
  })
}

main()
