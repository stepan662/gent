import { Worker, Event, Process } from './proto/model_pb'

type WorkerDescription = Worker.AsObject

type WorkerType = Map<string, WorkerDescription>

class WorkManager {
  workers: WorkerType = new Map()
  addWorker(workerId: string, description: WorkerDescription) {
    this.workers[workerId] = description
    this.printWorkers()
  }

  removeWorker(workerId: string) {
    delete this.workers[workerId]
    this.printWorkers()
  }

  getWorker(workerId: string) {
    this.printWorkers()
    return Boolean(this.workers[workerId])
  }

  onIncomingProcessData(workerId: string, data: Process.AsObject) {
    console.log(workerId, 'process', data)
  }

  onIncomingEventData(workerId: string, data: Event.AsObject) {
    console.log(workerId, 'event', data)
  }

  printWorkers() {
    console.log(this.workers)
  }
}

export default WorkManager
