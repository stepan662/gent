import BrokerDb from './BrokerDb'
import { ProcessInput } from './proto/model_pb'
import TasksQueue, { QueueTask } from './TasksQueue'
import { ExternalActionType, ProcessStateType } from './Types'
import WorkersManager from './WorkersManager'

class BrokerController {
  private queue: TasksQueue
  private worker: WorkersManager
  private db: BrokerDb

  constructor() {
    this.queue = new TasksQueue(this.processWork)
    this.db = new BrokerDb()
  }

  public processResult = async (state: ProcessStateType) => {
    const isExisting = Boolean(state.id)

    const result = isExisting
      ? await this.db.updateProcess({ ...state, active: false })
      : await this.db.createProcess({ ...state, active: false })

    if (state.actions.length > 0) {
      const results = await Promise.all(state.actions.map(this.handleExternalAction))
      setTimeout(
        () =>
          this.processWork(result.id, {
            _results: results,
          }),
        0,
      )
    } else if (result.status === 'running') {
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

  private processWork = async (processId: string, input?: any) => {
    const state = await this.db.getProcess(processId)
    const newState: ProcessStateType = {
      ...state,
      currentTask: state.nextTask,
      currentSubtask: state.nextSubtask,
      nextTask: null,
      nextSubtask: null,
      nextDeployTime: null,
      active: true,
      currentInput: input || null,
      actions: [],
    }

    const result = await this.db.updateProcess(newState)
    this.worker.sendMakeStep(result)
  }

  private handleExternalAction = (action: ExternalActionType) => {
    if (action.type === 'processStart') {
      return this.startProcess(action.data)
    }
  }

  private startProcess = async (input: ProcessInput.AsObject) => {
    const newProcess: ProcessStateType = {
      id: null,
      created: Date.now(),
      type: input.type,
      version: input.version,
      status: 'running',
      currentTask: null,
      currentSubtask: null,
      currentInput: null,
      nextTask: 'start',
      nextSubtask: 'init',
      nextDeployTime: null,
      taskState: null,
      state: null,
      input: input.input,
      output: null,
      error: null,
      tags: [],
      active: false,
      caller: input.caller,
      actions: [],
    }
    const result = await this.db.createProcess(newProcess)
    this.queue.add({ id: result.id, time: result.nextDeployTime })
    return { type: 'processStart', id: result.id, status: 'running' }
  }

  public registerWorker = (worker: WorkersManager) => {
    this.worker = worker
  }
}

export default BrokerController
