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
    const worker = this.getWorkerByType(input.type, input.version)

    if (!worker) {
      console.error(`Worker ${input.type}, ${input.version} doesn't exists`)
      return
    }

    const workerOut = new WorkerOut()
    workerOut.setValidateInput(processInputFromObject(input))

    worker.write(workerOut)
  }

  sendMakeStep = (state: Process.AsObject) => {
    console.log('sendMakeStep', state.currentTask, state.currentSubtask)
    const worker = this.getWorkerByType(state.type, state.version)

    if (!worker) {
      console.error(`Worker ${state.type}, ${state.version} doesn't exists`)
      return
    }

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

  printWorkers() {
    console.log(this.workers)
  }
}

export default WorkersManager
