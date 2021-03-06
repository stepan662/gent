import { SubtaskType } from './Subtask'
import { ProcessInput, ProcessExternalResponse } from './proto/model_pb'

/*
 *  Process state
 */
export type ProcessStateType = {
  id: string
  created: number
  type: string
  version: string
  status: string
  currentTask: string
  currentSubtask: string
  currentInput: any
  nextDeployTime: number
  nextTask: string
  nextSubtask: string
  taskState: any
  state: any
  input: any
  output: any
  error?: ProcessErrorType
  tags: string[]
  active: boolean
  caller?: Caller
  actions: ExternalActionType[]
}

export type Caller = {
  id: string
  task: string
  subtask: string
  type: string
  version: string
  subprocess: boolean
}

export type ExternalActionType =
  | {
      type: 'processStart'
      data: ProcessInput.AsObject
    }
  | {
      type: 'processResponse'
      data: ProcessExternalResponse.AsObject
    }

export type ProcessStatusType = 'running' | 'waiting' | 'error' | 'finished'

export type ProcessTasksType = {
  [id: string]: any
}

export type ProcessErrorType = {
  name: string
  message: string
  stack: string
}

/*
 *  Process
 */

// base for task, link, exclusive, start, end
export type ElementType = {
  id?: string
  name?: string
  description?: string
  type: 'link' | 'start' | 'end' | 'exclusive' | 'task'
}

export type LinkTypeType = 'error' | 'timeout' | undefined

export type LinkType = ElementType & {
  type: 'link'
  linkType?: LinkTypeType
}

export type ErrorCheckerInputType = string | string[] | ((e: ProcessErrorType) => boolean)

export type ErrorLinkType = LinkType & {
  linkType: 'error'
  error?: ErrorCheckerInputType
}

export type TimeoutLinkType = LinkType & {
  linkType: 'timeout'
  timeout: number
  exec: SubtaskType
}

export type StartType = ElementType & {
  _first: string
  type: 'start'
  init: SubtaskType
}

export type EndType = ElementType & {
  _first: string
  type: 'end'
  finish: SubtaskType
}

export type ExclusiveType = ElementType & {
  _first: string
  type: 'exclusive'
  decide: SubtaskType
}

export type TaskType = ElementType & {
  _first: string
  type: 'task'
  run: SubtaskType
}

export type NodeType = StartType | EndType | ExclusiveType | TaskType

/*
 * Executable process structure
 */
export interface ProcessType {
  nodes: NodeType[]
  connections: Connection[]
  attributes: ProcessAttributes
  getSchema(): any
}

export type Connection = LinkType & {
  from: string
  to: string
}

export type ProcessAttributes = {
  type: string
  version: string
  name?: string
  description?: string
}
