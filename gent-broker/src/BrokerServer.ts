import * as grpc from '@grpc/grpc-js'
import { Process, ProcessId, Processes, ProcessIds, Worker } from './proto/model_pb'
import { IBrokerServer } from './proto/model_grpc_pb'
import WorkersManager from './WorkersManager'
import { processFromObject, processToObject } from './serializers'
import BrokerController from './BrokerController'

export function getBrokerServer(manager: WorkersManager, controller: BrokerController) {
  class BrokerServer implements IBrokerServer {
    [name: string]: grpc.UntypedHandleCall

    worker: grpc.handleBidiStreamingCall<Worker, Process> = (call) => {
      const workerId = String(Date.now()) + '-' + String(Math.random())

      manager.addWorker(workerId, call.write.bind(call))

      call.on('data', (data: Worker) => {
        // register only first message from worker, then create worker
        manager.addWorkerDescription(workerId, data.toObject())
      })

      call.on('end', () => {
        manager.removeWorker(workerId)
      })

      call.on('error', (e) => {
        console.error(e)
      })
    }

    create_process: grpc.handleUnaryCall<Process, Process> = async (call, callback) => {
      const data = processToObject(call.request)
      const process = processFromObject(await manager.onProcessResult(data))
      callback(null, process)
    }

    step_result: grpc.handleUnaryCall<Process, Process> = async (call, callback) => {
      const data = processToObject(call.request)
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

    get_processes: grpc.handleUnaryCall<ProcessIds, Processes> = async (call, callback) => {
      const ids = call.request.getProcessidList()
      const processes = await controller.getProcesses(ids)
      const mappedProcesses = processes.map(processFromObject)
      const result = new Processes()
      result.setProcessesList(mappedProcesses)
      callback(null, result)
    }
  }
  return new BrokerServer()
}
