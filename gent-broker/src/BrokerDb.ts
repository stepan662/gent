import Process, { deserializeProcess } from './db/models/Process'
import { ProcessStateType } from './Types'

class BrokerDb {
  createProcess = async (i: ProcessStateType): Promise<ProcessStateType> => {
    const result = await Process.create({
      created: i.created && new Date(i.created),
      type: i.type,
      version: i.version,
      status: i.status,
      currentTask: i.currentTask,
      currentSubtask: i.currentSubtask,
      currentInput: i.currentInput,
      nextDeployTime: i.nextDeployTime ?? new Date(i.nextDeployTime),
      nextTask: i.nextTask,
      nextSubtask: i.nextSubtask,
      taskState: i.taskState,
      state: i.state,
      input: i.input,
      output: i.output,
      error: i.error,
      tags: i.tags,
      active: i.active,
      caller: i.caller,
      subProcesses: i.subProcesses,
    })
    return deserializeProcess(result)
  }

  updateProcess = async (i: ProcessStateType) => {
    const [_, result] = await Process.update(
      {
        created: i.created && new Date(i.created),
        type: i.type,
        version: i.version,
        status: i.status,
        currentTask: i.currentTask,
        currentSubtask: i.currentSubtask,
        currentInput: i.currentInput,
        nextDeployTime: i.nextDeployTime ?? new Date(i.nextDeployTime),
        nextTask: i.nextTask,
        nextSubtask: i.nextSubtask,
        taskState: i.taskState,
        state: i.state,
        input: i.input,
        output: i.output,
        error: i.error,
        tags: i.tags,
        active: i.active,
        caller: i.caller,
        subProcesses: i.subProcesses,
      },
      { where: { id: Number(i.id) }, returning: true },
    )
    return deserializeProcess(result[0])
  }

  getProcess = async (processId: string) => {
    const result = await Process.findByPk(Number(processId))
    return deserializeProcess(result)
  }

  getProcesses = async (processIds?: string[]) => {
    const result = await Process.findAll({
      where: processIds?.length ? { id: processIds } : undefined,
      order: [['id', 'DESC']],
      limit: processIds?.length || 20,
    })
    return result.map(deserializeProcess)
  }
}

export default BrokerDb
