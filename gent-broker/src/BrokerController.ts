import BrokerDb from './BrokerDb'
import TasksQueue, { PendingMessage } from './TasksQueue'
import { ProcessStateType, ProcessStatusType, SubProcessType } from './Types'
import WorkersManager from './WorkersManager'

class BrokerController {
  private queue: TasksQueue
  private worker: WorkersManager
  private db: BrokerDb

  constructor() {
    this.queue = new TasksQueue(this.processWork)
    this.db = new BrokerDb()
  }

  public processResult = async (inState: ProcessStateType) => {
    let state = { ...inState }
    const isExisting = Boolean(state.id)

    if (isExisting) {
      state = await this.startSubprocessesIfNew(state)
      state = await this.db.updateProcess(state)
    } else {
      state = await this.db.createProcess(state)
    }

    if (state.status === 'running' || this.queue.havePendingMessages(state.id)) {
      this.queue.add({ id: state.id, time: state.nextDeployTime })
    } else {
      // not active, not in queue
      this.queue.setActivity(state.id, false)
      if (state.status === 'finished') {
        this.updateCaller(state)
      }
    }

    return state
  }

  private dealWithPendingMessages = (state: ProcessStateType): ProcessStateType => {
    let subProcesses = state.subProcesses
    while (this.queue.havePendingMessages(state.id)) {
      const pendingMessage = this.queue.popPendingMessage(state.id)
      // update global subprocesses
      subProcesses = subProcesses.map((sp) => {
        if (sp.id === pendingMessage.source) {
          return {
            ...sp,
            status: pendingMessage.status,
          }
        }
        return sp
      })

      const callerInCorrectState =
        state.nextTask === pendingMessage.task &&
        state.nextSubtask === pendingMessage.subtask &&
        state.status === 'waiting'

      // let process know that subprocess finished
      // if in correct state
      if (callerInCorrectState) {
        return {
          ...state,
          subProcesses,
          status: 'running',
          currentInput: {
            finished: {
              id: pendingMessage.source,
              status: pendingMessage.status,
              output: pendingMessage.output,
            },
          },
        }
      }
    }

    return {
      ...state,
      subProcesses,
    }
  }

  private updateCaller = async (state: ProcessStateType) => {
    if (state.caller?.id) {
      this.queue.addPendingMessage({
        source: state.id,
        target: state.caller.id,
        task: state.caller.task,
        subtask: state.caller.subtask,
        status: state.status as ProcessStatusType,
        output: state.output,
      })
    }
  }

  private startSubprocessesIfNew = async (state: ProcessStateType): Promise<ProcessStateType> => {
    const newSubprocesses = state.subProcesses.filter((sp) => sp.status === 'init')
    let newState = state

    if (newSubprocesses.length > 0) {
      const startedIds = await Promise.all(
        newSubprocesses.map((sp) => this.startProcess(sp, state)),
      )
      let index = 0
      const subProcesses: SubProcessType[] = state.subProcesses.map((sp) => {
        if (sp.status === 'init') {
          const id = startedIds[index++]
          return {
            ...sp,
            id,
            input: null,
            status: 'running',
          }
        } else {
          return sp
        }
      })
      newState = {
        ...newState,
        subProcesses,
      }

      if (
        state.status === 'waiting' &&
        state.nextTask === state.currentTask &&
        state.nextSubtask === state.currentSubtask
      ) {
        newState = {
          ...newState,
          status: 'running',
          currentInput: {
            started: startedIds.map((id) => ({
              id: id,
              status: 'running',
              output: null,
            })),
          },
        }
      }
    }

    return newState
  }

  public getProcess = async (processId: string) => {
    return this.db.getProcess(processId)
  }

  public getProcesses = async (ids: string[]) => {
    return this.db.getProcesses(ids)
  }

  private processWork = async (processId: string) => {
    let state = await this.db.getProcess(processId)

    state = this.dealWithPendingMessages(state)

    if (state.status === 'running') {
      state = {
        ...state,
        currentTask: state.nextTask,
        currentSubtask: state.nextSubtask,
        nextTask: null,
        nextSubtask: null,
        nextDeployTime: null,
      }
    }
    state = await this.db.updateProcess(state)
    if (state.status === 'running') {
      this.worker.sendMakeStep(state)
    }
  }

  private startProcess = async (input: SubProcessType, caller: ProcessStateType) => {
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
      caller: {
        id: caller.id,
        task: caller.currentTask,
        subtask: caller.currentSubtask,
        type: caller.type,
        version: caller.version,
        reply: input.reply,
      },
      subProcesses: [],
    }
    const result = await this.db.createProcess(newProcess)
    this.queue.add({ id: result.id, time: result.nextDeployTime })
    return result.id
  }

  public registerWorker = (worker: WorkersManager) => {
    this.worker = worker
  }
}

export default BrokerController
