import { Process, ProcessInput, Worker, WorkerOut } from './proto/model_pb'
import { processFromObject, processInputFromObject } from './serializers'

type WorkerType = {
  id: string
  type: string
  version: string
  write: (data: WorkerOut) => boolean
}

class WorkersManager {
  workers: WorkerType[] = []
  addWorker(workerId: string, description: Worker.AsObject, write: (data: WorkerOut) => boolean) {
    this.workers.push({
      id: workerId,
      type: description.type,
      version: description.version,
      write,
    })
    this.printWorkers()
  }

  removeWorker(workerId: string) {
    this.workers = this.workers.filter((w) => w.id !== workerId)
    this.printWorkers()
  }

  getWorkerById(workerId: string) {
    this.printWorkers()
    return this.workers.find((w) => w.id === workerId)
  }

  async onCreateProcess(data: Process.AsObject): Promise<Process.AsObject> {
    console.log('create_process', data)
    return data
  }

  async onStepResult(data: Process.AsObject): Promise<Process.AsObject> {
    console.log('step_result', data)
    return data
  }

  sendValidateInput(input: ProcessInput.AsObject) {
    const worker = this.getWorkerOrError(input.type, input.version)

    const workerOut = new WorkerOut()
    workerOut.setValidateInput(processInputFromObject(input))

    worker.write(workerOut)
  }

  sendMakeStep(process: Process.AsObject) {
    const worker = this.getWorkerOrError(process.type, process.version)

    const workerOut = new WorkerOut()
    workerOut.setMakeStep(processFromObject(process))

    worker.write(workerOut)
  }

  getWorkerByType(type: string, version: string | null): WorkerType | undefined {
    return this.workers.find((w) => w.type === type && (version === null || w.version === version))
  }

  getWorkerOrError(type: string, version: string | null): WorkerType {
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
