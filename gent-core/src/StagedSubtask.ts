import { ProcessStateType } from './Types'
import { SubtaskResult } from './Subtask'
import { wrapResult } from './wrapResult'

type StageFunc = <T>(func: () => Promise<SubtaskResult<T> | T> | SubtaskResult<T> | T) => Promise<T>
type LoopFunc = <T>(
  func: (ctx: { index: number }) => Promise<SubtaskResult<T> | T> | SubtaskResult<T> | T,
) => Promise<T>

type StagedOperations = {
  stage: StageFunc
  loop: LoopFunc
}

export class StageInterruption {
  constructor(public result: SubtaskResult) {
    this.result = result
  }
}

export const staged = (
  subtask: (ctx: ProcessStateType & StagedOperations) => Promise<any> | any,
) => async (ctx: ProcessStateType) => {
  const _processed = ctx.taskState?._processed || []
  let newProcessed: any[]
  let index = 0

  const stage: StageFunc = async (func) => {
    if (index >= _processed.length) {
      const result = wrapResult(await func())
      newProcessed = [..._processed, result.returnData]
      throw new StageInterruption(result)
    } else {
      return _processed[index++]
    }
  }

  const loop: LoopFunc = async (func) => {
    if (index >= _processed.length) {
      const result = wrapResult(await func({ index: 0 }))
      newProcessed = [
        ..._processed,
        {
          index: 0,
          unfinished: !result.returnData,
          result: result.returnData,
        },
      ]
      throw new StageInterruption(result)
    } else {
      const previousData = _processed[index]
      if (previousData.unfinished) {
        const loopIndex = previousData.index + 1
        const result = wrapResult(await func({ index: loopIndex }))
        newProcessed = [..._processed]
        newProcessed[index] = {
          index: loopIndex,
          unfinished: !result.returnData,
          result: result.returnData,
        }
        throw new StageInterruption(result)
      } else {
        return _processed[index++].result
      }
    }
  }

  let result: SubtaskResult
  try {
    result = wrapResult(await subtask({ ...ctx, stage, loop }))
  } catch (e) {
    if (e instanceof StageInterruption) {
      return new SubtaskResult({
        ...e.result,
        taskState: {
          ...(e.result?.taskState || {}),
          _processed: newProcessed,
        },
        nextSubtask: ctx.currentSubtask,
      })
    } else {
      throw e
    }
  }

  return new SubtaskResult({
    ...result,
    taskState: {
      ...(result?.taskState, {}),
    },
  })
}
