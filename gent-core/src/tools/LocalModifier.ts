import {
  ModifierType,
  ProcessStateType,
  JournalMutationType,
  ProcessNotifierType,
  ProcessNotifierFilterType,
  ProcessResourceType,
} from '../Types'

type DataType = {
  process: ProcessStateType[]
  journal: JournalMutationType[]
  queue: ProcessNotifierType[]
  resources: ProcessResourceType[]
}

class Modifier implements ModifierType {
  data: DataType = {
    process: [],
    journal: [],
    queue: [],
    resources: [],
  }

  serialize(data) {
    return JSON.parse(JSON.stringify(data))
  }

  async createProcess(process: ProcessStateType) {
    const id = String(this.data.process.length)
    const newEntry = this.serialize({
      ...process,
      id,
    })
    this.data.process.push(newEntry)
    return newEntry
  }

  async getProcesses() {
    return this.data.process
  }

  async updateProcess(state: ProcessStateType) {
    const index = this.data.process.findIndex((p) => p.id === state.id)
    this.data.process[index] = this.serialize(state)
    return this.data.process[index]
  }

  async getProcess(processId: string): Promise<ProcessStateType> {
    return this.data.process.find((p) => p.id === processId)
  }

  async addJournalEntry(mutation: JournalMutationType): Promise<JournalMutationType> {
    const id = String(this.data.journal.length)
    const result = this.serialize({
      ...mutation,
      id,
    })
    this.data.journal.push(result)
    return result
  }

  async getJournalEntries(processId: string): Promise<JournalMutationType[]> {
    return this.data.journal.filter((mutation) => mutation.process_id === processId)
  }

  async addNotifier(notifier: ProcessNotifierType) {
    this.data.queue.push(this.serialize(notifier))
  }

  async getAndDeleteNotifier(options: ProcessNotifierFilterType) {
    const { active, ...search } = options

    const index = this.data.queue.findIndex((n) => {
      if (active && n.deploy_time > Date.now()) {
        return false
      }
      for (const [key, value] of Object.entries(search)) {
        if (n[key] !== value) {
          return false
        }
      }
      return true
    })
    const notifier = index !== -1 && this.data.queue[index]
    if (notifier) {
      this.data.queue = this.data.queue.filter((_, i) => i !== index)
    }
    return notifier || null
  }
}

export default Modifier
