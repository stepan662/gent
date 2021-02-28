import { ProcessStateType } from './Types'

type SubtaskResultType<T> = {
  taskState?: any
  state?: any
  nextTask?: string | null
  nextSubtask?: string
  delay?: number
  pause?: boolean
  returnData?: T
}

export class SubtaskResult<T = any> implements SubtaskResultType<T> {
  taskState?: any
  state?: any
  nextTask?: string
  nextSubtask?: string
  delay?: number
  pause?: boolean
  returnData?: T

  constructor(options: SubtaskResultType<T>) {
    this.taskState = options.taskState
    this.state = options.state
    this.nextTask = options.nextTask
    this.nextSubtask = options.nextSubtask
    this.delay = options.delay
    this.pause = options.pause
    this.returnData = options.returnData
  }
}

export type SubtaskType<T = any> = (
  input?: ProcessStateType,
) => Promise<SubtaskResult<T> | void | any> | SubtaskResult<T> | void | any
