import { Process, ProcessInput, Worker, WorkerOut } from './proto/model_pb'
import { processFromObject, processInputFromObject } from './serializers'
import TasksQueue from './TasksQueue'

type WorkerType = {
  id: string
  type: string
  version: string
  write: (data: WorkerOut) => boolean
}

class WorkersManager {
  workers: WorkerType[]
  queue: TasksQueue

  constructor() {
    this.workers = []
    this.queue = new TasksQueue(this.sendMakeStep)
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

  onCreateProcess = (data: Process.AsObject) => {
    this.queue.add(data)
    return data
  }

  onStepResult = (data: Process.AsObject) => {
    if (data.status === 'running') {
      this.queue.add(data)
    } else {
      console.log(data.status, data)
    }
    return data
  }

  sendValidateInput = (input: ProcessInput.AsObject) => {
    const worker = this.getWorkerOrFail(input.type, input.version)

    const workerOut = new WorkerOut()
    workerOut.setValidateInput(processInputFromObject(input))

    worker.write(workerOut)
  }

  sendMakeStep = (state: Process.AsObject) => {
    console.log('sendMakeStep')
    const worker = this.getWorkerOrFail(state.type, state.version)

    const workerOut = new WorkerOut()

    const newProcess: Process.AsObject = {
      ...state,
      currentTask: state.nextTask,
      currentSubtask: state.nextSubtask,
      nextTask: null,
      nextSubtask: null,
      nextDeployTime: null,
    }

    workerOut.setMakeStep(processFromObject(newProcess))

    worker.write(workerOut)
  }

  getWorkerByType = (type: string, version: string | null): WorkerType | undefined => {
    return this.workers.find((w) => w.type === type && (version === null || w.version === version))
  }

  getWorkerOrFail = (type: string, version: string | null): WorkerType => {
    const worker = this.getWorkerByType(type, version)
    if (!worker) {
      throw new Error(`Worker ${type}, ${version} doesn't exists`)
    }
    return worker
  }

  printWorkers() {
    console.log(this.workers)
  }
}

export default WorkersManager
