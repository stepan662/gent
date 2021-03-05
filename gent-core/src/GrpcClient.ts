import * as grpc from '@grpc/grpc-js'
import { BrokerClient } from './proto/model_grpc_pb'
import { Worker, Process, ProcessId, Empty } from './proto/model_pb'
import { ProcessStateType } from './Types'
import { processFromObject, processToObject, workerFromObject } from './tools/serializers'

class GrpcClient {
  client: BrokerClient
  worker: grpc.ClientDuplexStream<Worker, Process>
  onMessage: (data: ProcessStateType) => any
  type: string
  version: string
  reconnect: NodeJS.Timeout

  constructor() {
    this.client = new BrokerClient('localhost:50051', grpc.credentials.createInsecure())
  }

  startWorker = async (
    onMessage: (data: ProcessStateType) => any,
    type: string,
    version: string,
  ) => {
    this.onMessage = onMessage
    this.type = type
    this.version = version
    this.connect()
  }

  private connect = () => {
    this.reconnect = null

    this.worker = this.client.worker()

    this.worker.on('data', (data: Process) => {
      const process = processToObject(data)
      this.onMessage(process)
    })

    this.worker.on('close', () => {
      console.log('closed')
      this.retry()
    })

    this.worker.on('error', (e) => {
      console.error('error', e)
      this.retry()
    })

    this.worker.write(workerFromObject({ type: this.type, version: this.version }))
  }

  private retry = () => {
    if (!this.reconnect) {
      console.log('retry in 5s')
      this.reconnect = setTimeout(this.connect, 5000)
    }
  }

  processStepResult = async (data: ProcessStateType) => {
    return new Promise((resolve, reject) => {
      this.client.step_result(processFromObject(data), (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(processToObject(data))
        }
      })
    })
  }

  createProcess = (data: ProcessStateType): Promise<ProcessStateType> => {
    return new Promise((resolve, reject) => {
      this.client.create_process(processFromObject(data), (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(processToObject(data))
        }
      })
    })
  }

  public getProcess = async (processId: string): Promise<ProcessStateType> => {
    return new Promise((resolve, reject) => {
      const input = new ProcessId()
      input.setProcessid(processId)
      this.client.get_process(input, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(processToObject(data))
        }
      })
    })
  }

  public getProcesses = async (): Promise<ProcessStateType[]> => {
    return new Promise((resolve, reject) => {
      const input = new Empty()
      this.client.get_processes(input, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.getProcessesList().map(processToObject))
        }
      })
    })
  }

  close = () => {
    this.worker.cancel()
  }
}

export default GrpcClient
