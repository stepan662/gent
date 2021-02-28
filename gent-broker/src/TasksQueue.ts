export type QueueTask = {
  id: string
  time: number
}

class TasksQueue {
  private tasks: QueueTask[]
  private scheduledTimeout: NodeJS.Timeout = null

  constructor(private onWork: (process: QueueTask) => void) {
    this.onWork = onWork
    this.tasks = []
    setTimeout(this.reschedule, 1000)
  }

  add = (task: QueueTask) => {
    if (!task.time) {
      this.onWork(task)
    } else {
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
    // this.tasks.forEach((t) => {
    //   const delay = this.calculateDelay(t)
    //   console.log(`${delay / 1000}s`)
    // })
    // console.log(`closest task in:            ${closestTask / 1000} s`)
    // console.log(`another check scheduled in: ${nextSchedule / 1000} s`)
    // console.log('\n')
  }

  private workOnQueue = () => {
    const now = Date.now()

    let workableTasks = []
    while (this.tasks.length > 0 && this.tasks[0].time < now) {
      const process = this.tasks.shift()
      workableTasks.push(process)
    }
    workableTasks.forEach(this.onWork)

    this.reschedule()
  }
}

export default TasksQueue
