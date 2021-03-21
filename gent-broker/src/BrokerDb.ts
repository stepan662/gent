import Process, { deserializeProcess, serializeProcess } from './db/models/Process'
import { ProcessStateType } from './Types'
import { db } from './db/connection'

class BrokerDb {
  createProcess = async (i: ProcessStateType): Promise<ProcessStateType> => {
    const result = await Process.create({
      ...serializeProcess(i),
      created: i.created && new Date(i.created),
    })
    return deserializeProcess(result)
  }

  updateProcess = async (i: ProcessStateType) => {
    const [_, result] = await Process.update(
      { ...serializeProcess(i) },
      { where: { id: Number(i.id) }, returning: true },
    )
    return deserializeProcess(result[0])
  }

  updateProcessInTransaction = async (
    processId: string,
    callback: (state: ProcessStateType) => Promise<ProcessStateType | null>,
  ): Promise<[boolean, ProcessStateType]> => {
    return db.transaction(async (transaction) => {
      const rawState = await Process.findByPk(Number(processId), { transaction })
      const state = deserializeProcess(rawState)
      const result = await callback(state)
      if (result) {
        const [_, updated] = await Process.update(serializeProcess(result), {
          where: { id: Number(processId) },
          returning: true,
        })
        return [true, deserializeProcess(updated[0])]
      } else {
        return [false, state]
      }
    })
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
