import BrokerController from './BrokerController'
import { Process, Worker, WorkerOut } from './proto/model_pb'
import { processFromObject } from './serializers'

type WorkerType = {
  id: string
  type: string
  version: string
  write: (data: WorkerOut) => boolean
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
    write: (data: WorkerOut) => boolean,
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
    console.log('worker DISCONNECT', worker.type, worker.version)
    this.workers = this.workers.filter((w) => w.id !== workerId)
  }

  getWorkerById = (workerId: string) => {
    return this.workers.find((w) => w.id === workerId)
  }

  onProcessResult = async (data: Process.AsObject) => {
    return this.controller.processResult(data)
  }

  sendMakeStep = (state: Process.AsObject) => {
    const worker = this.getWorkerByType(state.type, state.version)

    if (!worker) {
      console.error(`Worker ${state.type}, ${state.version} doesn't exists`)
      return
    }

    const workerOut = new WorkerOut()

    workerOut.setMakeStep(processFromObject(state))

    worker.write(workerOut)
  }

  getWorkerByType = (type: string, version: string | null): WorkerType | undefined => {
    return this.workers.find((w) => w.type === type && (version === null || w.version === version))
  }
}

export default WorkersManager
