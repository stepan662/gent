type SubtaskResultType = {
  output?: any
  nextTask?: string | null
  nextSubtask?: string
  delay?: number
  pause?: boolean
}

export class SubtaskResult implements SubtaskResult {
  output?: any
  nextTask?: string
  nextSubtask?: string
  delay?: number
  pause?: boolean

  constructor(props: SubtaskResultType) {
    this.output = props.output
    this.nextTask = props.nextTask
    this.nextSubtask = props.nextSubtask
    this.delay = props.delay
    this.pause = props.pause
  }
}

type SubtaskType = {
  func: (input?: any) => Promise<SubtaskResult> | SubtaskResult
  type: 'sync' | 'async' | 'read'
  attrs?: any
}

export class Subtask implements SubtaskType {
  func: (input?: any) => Promise<SubtaskResult> | SubtaskResult
  type: 'sync' | 'async' | 'read'
  attrs: any

  constructor(props: SubtaskType) {
    this.func = props.func
    this.type = props.type
    this.attrs = props.attrs
  }
}
