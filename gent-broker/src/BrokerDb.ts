import { Process } from './proto/model_pb'

class BrokerDb {
  private processes: Process.AsObject[] = []
  private lastId = 0

  createProcess = async (state: Process.AsObject) => {
    const newProcess = {
      ...state,
      id: `proc-${this.lastId++}`,
    }
    this.processes.push(newProcess)
    console.log(`create process ${newProcess.id}`, this.processes)
    return newProcess
  }

  updateProcess = async (state: Process.AsObject) => {
    const procIndex = this.processes.findIndex((p) => p.id === state.id)
    this.processes[procIndex] = state
    console.log(`updateProcess ${state.id}`, this.processes)
    return state
  }

  getProcess = async (processId: string) => {
    console.log(`getProcess ${processId}`, this.processes)
    return this.processes.find((p) => p.id === processId)
  }

  getAllProcesses = async () => {
    return this.processes
  }
}

export default BrokerDb
