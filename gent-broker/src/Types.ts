import { ProcessExternalResponse, ProcessInput } from './proto/model_pb'

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

export type ProcessErrorType = {
  name: string
  message: string
  stack: string
}
