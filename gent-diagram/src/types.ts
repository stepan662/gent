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
}

export type ProcessErrorType = {
  name: string
  message: string
  stack: string
}