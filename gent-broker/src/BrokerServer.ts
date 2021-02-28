import * as grpc from '@grpc/grpc-js'
import { Process, WorkerIn, WorkerOut, ProcessId, Processes, Empty } from './proto/model_pb'
import { IBrokerServer } from './proto/model_grpc_pb'
import WorkersManager from './WorkersManager'
import { processFromObject } from './serializers'
import BrokerController from './BrokerController'

export function getBrokerServer(manager: WorkersManager, controller: BrokerController) {
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
            manager.addWorker(workerId, data.registerWorker, call.write.bind(call))
          } else {
            // unexpected message
            call.destroy(new Error(`Expecting 'registerWorker'`))
          }
        } else {
          // worker is initialized
          if (data.createProcess) {
            // recieving process data
            manager.onProcessResult(data.createProcess)
          } else if (data.stepResult) {
            // recieving event data
            manager.onProcessResult(data.stepResult)
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
      const process = processFromObject(await manager.onProcessResult(data))
      callback(null, process)
    }
    step_result: grpc.handleUnaryCall<Process, Process> = async (call, callback) => {
      const data = call.request.toObject()
      const process = processFromObject(await manager.onProcessResult(data))
      callback(null, process)
    }

    get_process: grpc.handleUnaryCall<ProcessId, Process> = async (call, callback) => {
      const id = call.request.getProcessid()
      try {
        const process = await controller.getProcess(id)
        const mappedProcess = processFromObject(process)
        callback(null, mappedProcess)
      } catch (e) {
        callback(e)
      }
    }

    get_processes: grpc.handleUnaryCall<Empty, Processes> = async (_call, callback) => {
      const processes = await controller.getProcesses()
      const mappedProcesses = processes.map(processFromObject)
      const result = new Processes()
      result.setProcessesList(mappedProcesses)
      callback(null, result)
    }
  }
  return new BrokerServer()
}