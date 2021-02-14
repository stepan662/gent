import * as grpc from '@grpc/grpc-js'
import { WorkerMessage, Worker } from './proto/model_pb'
import { IBrokerServer } from './proto/model_grpc_pb'
import WorkManager from './WorkManager'

export function getBrokerServer(manager: WorkManager) {
  class BrokerServer implements IBrokerServer {
    [name: string]: grpc.UntypedHandleCall

    worker: grpc.handleBidiStreamingCall<WorkerMessage, WorkerMessage> = (call) => {
      const workerId = String(Date.now()) + '-' + String(Math.random())
      call.on('data', (raw: WorkerMessage) => {
        const data = raw.toObject()
        const worker = manager.getWorker(workerId)
        if (!worker) {
          // worker is not initialized
          if (data.worker) {
            // inicializing worker
            manager.addWorker(workerId, data.worker)
          } else {
            // unexpected message
            call.destroy(new Error(`Expecting message with field 'worker'`))
          }
        } else {
          // worker is initialized
          if (data.process) {
            // recieving process data
            manager.onIncomingProcessData(workerId, data.process)
          } else if (data.event) {
            // recieving event data
            manager.onIncomingEventData(workerId, data.event)
          } else {
            // unexpected message
            call.destroy(new Error(`Expecting message with field 'process' or 'event'`))
          }
        }
      })
      call.on('end', () => {
        manager.removeWorker(workerId)
      })
    }
  }
  return new BrokerServer()
}
