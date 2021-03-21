import { SubProcessType, ProcessStateType } from './Types'

type SubtaskResultType<T> = {
  taskState?: any
  state?: any
  nextTask?: string | null
  nextSubtask?: string
  delay?: number
  pause?: boolean
  subProcesses?: SubProcessType[]
  returnData?: T
}

export class SubtaskResult<T = any> implements SubtaskResultType<T> {
  taskState?: any
  state?: any
  nextTask?: string
  nextSubtask?: string
  delay?: number
  pause?: boolean
  subProcesses: SubProcessType[]
  returnData?: T

  constructor(options: SubtaskResultType<T>) {
    if (options.taskState !== undefined) this.taskState = options.taskState
    if (options.state !== undefined) this.state = options.state
    if (options.nextTask !== undefined) this.nextTask = options.nextTask
    if (options.nextSubtask !== undefined) this.nextSubtask = options.nextSubtask
    if (options.delay !== undefined) this.delay = options.delay
    if (options.pause !== undefined) this.pause = options.pause
    if (options.subProcesses !== undefined) this.subProcesses = options.subProcesses
    if (options.returnData !== undefined) this.returnData = options.returnData
  }
}

export type SubtaskResultGeneric<T = any> =
  | Promise<SubtaskResult<T> | void | any>
  | SubtaskResult<T>
  | void
  | any

export type SubtaskType<T = any> = (input?: ProcessStateType) => SubtaskResultGeneric<T>
