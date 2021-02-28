import BrokerDb from './BrokerDb'
import { Process } from './proto/model_pb'
import TasksQueue, { QueueTask } from './TasksQueue'
import WorkersManager from './WorkersManager'

class BrokerController {
  private queue: TasksQueue
  private worker: WorkersManager
  private db: BrokerDb

  constructor(db: BrokerDb) {
    this.queue = new TasksQueue(this.processWork)
    this.db = db
  }

  public processResult = async (state: Process.AsObject) => {
    const isExisting = Boolean(state.id)
    const result = isExisting
      ? await this.db.updateProcess(state)
      : await this.db.createProcess(state)

    if (result.status === 'running') {
      this.queue.add({ id: result.id, time: result.nextDeployTime })
    }

    return result
  }

  public getProcess = async (processId: string) => {
    return this.db.getProcess(processId)
  }

  public getProcesses = async () => {
    return this.db.getAllProcesses()
  }

  private processWork = async (task: QueueTask) => {
    const state = await this.db.getProcess(task.id)
    const newState: Process.AsObject = {
      ...state,
      currentTask: state.nextTask,
      currentSubtask: state.nextSubtask,
      nextTask: null,
      nextSubtask: null,
      nextDeployTime: null,
    }

    const result = await this.db.updateProcess(newState)
    this.worker.sendMakeStep(result)
  }

  public registerWorker = (worker: WorkersManager) => {
    this.worker = worker
  }
}

export default BrokerController
