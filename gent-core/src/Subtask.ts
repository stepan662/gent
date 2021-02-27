type SubtaskResultType = {
  state?: any
  nextTask?: string | null
  nextSubtask?: string
  delay?: number
  pause?: boolean
}

export class SubtaskResult implements SubtaskResultType {
  state?: any
  nextTask?: string
  nextSubtask?: string
  delay?: number
  pause?: boolean

  constructor(props?: SubtaskResultType) {
    this.nextTask = props?.nextTask
    this.nextSubtask = props?.nextSubtask
    this.delay = props?.delay
    this.pause = props?.pause
  }
}

export type SubtaskType = (
  input?: any,
) => Promise<SubtaskResult | void | any> | SubtaskResult | void | any
