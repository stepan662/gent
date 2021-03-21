import { ProcessStatusType } from './Types'

export type PendingMessage = {
  source: string
  target: string
  status: ProcessStatusType | 'init'
  task: string
  subtask: string
  output: any
}

export type QueueTask = {
  id: string
  time: number
}

class TasksQueue {
  private tasks: QueueTask[]
  private activeProcesses: string[]
  private scheduledTimeout: NodeJS.Timeout = null
  private pendingMessages: PendingMessage[]

  constructor(private onWork: (processId: string) => void) {
    this.onWork = onWork
    this.tasks = []
    this.activeProcesses = []
    this.pendingMessages = []
    setTimeout(this.reschedule, 1000)
  }

  isActive = (processId: string) => {
    return this.activeProcesses.includes(processId)
  }

  setActivity = (processId: string, active: boolean) => {
    if (active) {
      if (this.isActive(processId)) {
        throw new Error(`Process ${processId} is already active`)
      }
      this.activeProcesses.push(processId)
    } else {
      this.activeProcesses = this.activeProcesses.filter((p) => p !== processId)
    }
  }

  add = (task: QueueTask) => {
    this.setActivity(task.id, false)
    if (!task.time) {
      task.time = 0
    }
    this.tasks.push(task)
    this.tasks.sort((a, b) => {
      if (a.time > b.time) {
        return 1
      } else {
        return -1
      }
    })
    const delay = this.calculateDelay(task)
    console.log(`new task scheduled in:      ${delay / 1000}s`)
    this.reschedule()
  }

  find = (id: string) => {
    return this.tasks.find((t) => t.id === id)
  }

  havePendingMessages = (processId) => {
    return this.pendingMessages.find((m) => m.target === processId)
  }

  addPendingMessage = (message: PendingMessage) => {
    this.pendingMessages.push(message)
    if (!this.isActive(message.target) && !this.find(message.target)) {
      this.add({ id: message.target, time: null })
    }
  }

  popPendingMessage = (processId: string): PendingMessage | undefined => {
    console.log(this.pendingMessages)
    const message = this.pendingMessages.find((m) => m.target === processId)
    this.pendingMessages = this.pendingMessages.filter((m) => m !== message)
    console.log(this.pendingMessages)
    return message
  }

  private calculateDelay = (task: QueueTask, max?: number) => {
    const now = Date.now()
    if (!task) {
      return max
    }
    const delay = task.time - now
    const futureDelay = delay > 0 ? delay : 0
    if (max) {
      return futureDelay > max ? max : futureDelay
    } else {
      return futureDelay
    }
  }

  private reschedule = () => {
    clearTimeout(this.scheduledTimeout)
    // const closestTask = this.calculateDelay(this.tasks[0])
    const nextSchedule = this.calculateDelay(this.tasks[0], 5000)
    if (nextSchedule !== undefined) {
      this.scheduledTimeout = setTimeout(this.workOnQueue, nextSchedule)
    }
  }

  private workOnQueue = () => {
    const now = Date.now()

    let workableTasks: QueueTask[] = []
    while (this.tasks.length > 0 && this.tasks[0].time < now) {
      const process = this.tasks.shift()
      this.setActivity(process.id, true)
      workableTasks.push(process)
    }
    workableTasks.forEach((t) => this.onWork(t.id))

    this.reschedule()
  }
}

export default TasksQueue
