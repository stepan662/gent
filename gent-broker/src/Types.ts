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
  caller?: CallerType
  subProcesses: SubProcessType[]
}

export type CallerType = {
  id: string
  task: string
  subtask: string
  type: string
  version: string
  reply: boolean
}

export type SubProcessType = {
  id: string
  status: ProcessStatusType | 'init'
  input: string
  type: string
  version: string
  task: string
  reply: boolean
}

export type ProcessStatusType = 'running' | 'waiting' | 'error' | 'finished'

export type ProcessErrorType = {
  name: string
  message: string
  stack: string
}
