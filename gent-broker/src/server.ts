import * as grpc from '@grpc/grpc-js'
import { BrokerService } from './proto/model_grpc_pb'
import { getBrokerServer } from './BrokerServer'
import WorkManager from './WorkersManager'
import BrokerController from './BrokerController'
import { db } from './db/connection'

async function main() {
  await db.authenticate()
  const controller = new BrokerController()
  const workManager = new WorkManager(controller)
  controller.registerWorker(workManager)
  const server = new grpc.Server()
  server.addService(BrokerService, getBrokerServer(workManager, controller))

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
