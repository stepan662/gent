import BrokerDb from './BrokerDb'
import TasksQueue from './TasksQueue'
import { ProcessStateType, SubProcessType } from './Types'
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

    let result: ProcessStateType
    if (isExisting) {
      const updatedState = await this.dealWithSubProcesses(state)
      result = await this.db.updateProcess({ ...updatedState, active: false })
    } else {
      result = await this.db.createProcess({ ...state, active: false })
    }

    if (result.status === 'running') {
      this.queue.add({ id: result.id, time: result.nextDeployTime })
    } else if (result.status === 'finished') {
      await this.dealWithCaller(result)
    }

    return result
  }

  private dealWithCaller = async (state: ProcessStateType) => {
    if (state.caller && state.caller.reply && state.caller.id) {
      const callerState = await this.db.getProcess(state.caller.id)
      const subProcesses: SubProcessType[] = callerState.subProcesses?.map((sp) => {
        if (sp.id === state.id) {
          return {
            ...sp,
            status: state.status as any,
          }
        } else {
          return sp
        }
      })

      let newCallerState = {
        ...callerState,
        subProcesses,
      }

      const callerIsWaiting =
        callerState.active === false &&
        callerState.status === 'waiting' &&
        callerState.nextTask === state.caller.task &&
        callerState.nextSubtask === state.caller.subtask

      if (callerIsWaiting) {
        newCallerState = {
          ...newCallerState,
          status: 'running',
          currentInput: {
            finished: {
              id: state.id,
              status: state.status,
              output: state.output,
            },
          },
        }
      }

      const result = await this.db.updateProcess(newCallerState)

      if (callerIsWaiting) {
        this.queue.add({ id: result.id, time: result.nextDeployTime })
      }
    }
  }

  private dealWithSubProcesses = async (state: ProcessStateType): Promise<ProcessStateType> => {
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

  public getProcesses = async () => {
    return this.db.getAllProcesses()
  }

  private processWork = async (processId: string) => {
    const state = await this.db.getProcess(processId)

    const newState: ProcessStateType = {
      ...state,
      currentTask: state.nextTask,
      currentSubtask: state.nextSubtask,
      nextTask: null,
      nextSubtask: null,
      nextDeployTime: null,
      active: true,
    }

    const result = await this.db.updateProcess(newState)
    this.worker.sendMakeStep(result)
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
      active: false,
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
