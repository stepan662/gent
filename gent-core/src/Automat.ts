import { ProcessStateType, StartType, NodeType } from './Types'

import Process from './Process'
import { SubtaskResult } from './Subtask'
import { stringify } from 'querystring'

class Automat {
  process: Process
  debug: boolean

  constructor(process: Process, debug = false) {
    this.process = process
    this.debug = debug
  }

  public startProcess = async (initialData: any, type: string, version: string) => {
    const start = this.process.nodes[0] as StartType

    const initState: ProcessStateType = {
      id: null,
      created: Date.now(),
      type: type,
      version: version,
      status: 'running',
      currentTask: start.id,
      currentSubtask: 'init',
      currentInput: null,
      nextTask: null,
      nextSubtask: null,
      nextDeployTime: null,
      taskState: null,
      state: null,
      input: initialData,
      output: null,
      error: null,
      tags: [],
      active: null,
    }

    return this.step(initState)
  }

  public step = async (state: ProcessStateType): Promise<ProcessStateType> => {
    const task = this.process.getNode(state.currentTask)

    try {
      const rawResult = await task[state.currentSubtask]({ ...state })
      const result = this.getResult(task, rawResult)

      if (!result.nextTask && task.type === 'end') {
        return {
          ...state,
          status: 'finished',
        }
      } else {
        return {
          ...state,
          nextTask: result.nextTask,
          nextSubtask: result.nextSubtask,
          nextDeployTime: result.deployTime,
          state: result.state || state.state,
          taskState: result.isNewTask ? null : result.taskState || state.taskState,
        }
      }
    } catch (e) {
      return {
        ...state,
        status: 'error',
        error: e,
      }
    }
  }

  private getResult(
    node: NodeType,
    rawResult: any,
  ): SubtaskResult & { isNewTask: boolean; deployTime: number } {
    const result = rawResult instanceof SubtaskResult ? rawResult : { state: rawResult }

    let nextTask: string
    let nextSubtask: string
    let isNewTask: boolean

    if (result.nextTask && result.nextSubtask) {
      throw new Error(`It's forbitten to use "nextTask" and "nextSubtask" at the same time`)
    } else if (result?.nextTask) {
      const next = this.process.getNode(result.nextTask)
      if (!next) {
        throw new Error(`Task "${result.nextTask}" doesn't exists`)
      }
      nextTask = next.id
      nextSubtask = next._first
      isNewTask = true
    } else if (result.nextSubtask) {
      nextTask = node.id
      nextSubtask = result.nextSubtask
      isNewTask = false
    } else {
      const next = this.process.nextNode(node)
      nextTask = next?.id
      nextSubtask = next?._first
      isNewTask = true
    }

    return {
      ...result,
      nextTask,
      nextSubtask,
      deployTime: this.getDeployTime(result?.delay),
      isNewTask,
    }
  }

  private getDeployTime(delay: number) {
    return delay ? Date.now() + delay : null
  }
}

export default Automat
