import * as grpc from '@grpc/grpc-js'
import { Process, ProcessInput, WorkerIn, WorkerOut } from './proto/model_pb'
import { IBrokerServer } from './proto/model_grpc_pb'
import WorkersManager from './WorkersManager'
import { processFromObject } from './serializers'

export function getBrokerServer(manager: WorkersManager) {
  class BrokerServer implements IBrokerServer {
    [name: string]: grpc.UntypedHandleCall

    worker: grpc.handleBidiStreamingCall<WorkerIn, WorkerOut> = (call) => {
      const workerId = String(Date.now()) + '-' + String(Math.random())
      call.on('data', (raw: WorkerIn) => {
        const data = raw.toObject()
        const worker = manager.getWorkerById(workerId)
        if (!worker) {
          // worker is not initialized
          if (data.registerWorker) {
            // inicializing worker
            manager.addWorker(workerId, data.registerWorker, call.write)
          } else {
            // unexpected message
            call.destroy(new Error(`Expecting 'registerWorker'`))
          }
        } else {
          // worker is initialized
          if (data.createProcess) {
            // recieving process data
            manager.onCreateProcess(data.createProcess)
          } else if (data.stepResult) {
            // recieving event data
            manager.onStepResult(data.stepResult)
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

    create_process: grpc.handleUnaryCall<Process, Process> = async (call, callback) => {
      const data = call.request.toObject()
      const process = processFromObject(await manager.onCreateProcess(data))
      callback(null, process)
    }
    step_result: grpc.handleUnaryCall<Process, Process> = async (call, callback) => {
      const data = call.request.toObject()
      const process = processFromObject(await manager.onStepResult(data))
      callback(null, process)
    }
  }
  return new BrokerServer()
}
