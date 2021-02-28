import * as grpc from '@grpc/grpc-js'
import { BrokerClient } from '../proto/model_grpc_pb'
import { WorkerIn, WorkerOut, Process } from '../proto/model_pb'
import { ProcessStateType } from '../Types'
import { processFromObject, processToObject, workerFromObject } from './serializers'

class GrpcClient {
  client: BrokerClient
  worker: grpc.ClientDuplexStream<WorkerIn, WorkerOut>
  onMessage: (data: ProcessStateType) => any

  constructor() {
    this.client = new BrokerClient('localhost:50051', grpc.credentials.createInsecure())
  }

  startWorker = async (
    onMessage: (data: ProcessStateType) => any,
    type: string,
    version: string,
  ) => {
    this.onMessage = onMessage
    this.worker = this.client.worker()
    this.worker.on('data', (data: WorkerOut) => {
      const process = processToObject(data.getMakeStep())
      this.onMessage(process)
    })

    const msg = new WorkerIn()
    msg.setRegisterWorker(
      workerFromObject({
        type,
        version,
      }),
    )

    this.worker.write(msg)

    return this.worker
  }

  processStepResult = async (process: ProcessStateType) => {
    return new Promise((resolve) => {
      const msg = new WorkerIn()
      msg.setStepResult(processFromObject(process))
      this.worker.write(msg, () => resolve(null))
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

  close = () => {
    this.worker.end()
  }
}

export default GrpcClient
