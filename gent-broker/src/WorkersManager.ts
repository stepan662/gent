import BrokerController from './BrokerController'
import { Process, Worker } from './proto/model_pb'
import { processFromObject } from './serializers'
import { ProcessStateType } from './Types'

type WorkerType = {
  id: string
  type: string
  version: string
  write: (data: Process) => boolean
}

class WorkersManager {
  private workers: WorkerType[]
  private controller: BrokerController

  constructor(controller: BrokerController) {
    this.workers = []
    this.controller = controller
  }

  addWorker = (
    workerId: string,
    description: Worker.AsObject,
    write: (data: Process) => boolean,
  ) => {
    this.workers.push({
      id: workerId,
      type: description.type,
      version: description.version,
      write,
    })
    console.log('worker CONNECT', description.type, description.version)
  }

  removeWorker = (workerId: string) => {
    const worker = this.getWorkerById(workerId)
    if (worker) {
      console.log('worker DISCONNECT', worker.type, worker.version)
      this.workers = this.workers.filter((w) => w.id !== workerId)
    }
  }

  getWorkerById = (workerId: string) => {
    return this.workers.find((w) => w.id === workerId)
  }

  onProcessResult = async (data: ProcessStateType) => {
    return this.controller.processResult(data)
  }

  sendMakeStep = (state: ProcessStateType) => {
    const worker = this.getWorkerByType(state.type, state.version)

    if (!worker) {
      console.error(`Worker ${state.type}, ${state.version} doesn't exists`)
      return
    }

    worker.write(processFromObject(state))
  }

  getWorkerByType = (type: string, version: string | null): WorkerType | undefined => {
    return this.workers.find((w) => w.type === type && (version === null || w.version === version))
  }
}

export default WorkersManager
