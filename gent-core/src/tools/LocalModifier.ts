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

const data: DataType = {
  process: [],
  journal: [],
  queue: [],
  resources: [],
}

class Modifier implements ModifierType {
  async createProcess(process: ProcessStateType) {
    const id = String(data.process.length)
    const newEntry = {
      ...process,
      id,
    }
    data.process.push(newEntry)
    return newEntry
  }

  async getProcesses() {
    return data.process
  }

  async updateProcess(state: ProcessStateType) {
    const index = data.process.findIndex((p) => p.id === state.id)
    data.process[index] = state
    return data.process[index]
  }

  async getProcess(processId: string): Promise<ProcessStateType> {
    return data.process.find((p) => p.id === processId)
  }

  async addJournalEntry(mutation: JournalMutationType): Promise<JournalMutationType> {
    const id = String(data.journal.length)
    const result = {
      ...mutation,
      id,
    }
    data.journal.push(result)
    return result
  }

  async getJournalEntries(processId: string): Promise<JournalMutationType[]> {
    return data.journal.filter((mutation) => mutation.process_id === processId)
  }

  async addNotifier(notifier: ProcessNotifierType) {
    data.queue.push(notifier)
  }

  async getAndDeleteNotifier(options: ProcessNotifierFilterType) {
    const { active, ...search } = options

    const notifier = data.queue.find((n) => {
      for (const [key, value] of Object.entries(search)) {
        if (active && n.deploy_time > Date.now()) {
          return false
        }
        if (n[key] !== value) {
          return false
        }
      }
      return true
    })
    if (notifier) {
      data.queue = data.queue.filter((n) => n !== notifier)
    }
    return notifier
  }
}

export default Modifier
