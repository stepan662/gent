import { ProcessStateType, StartType, NodeType } from './Types'

import Process from './Process'
import { SubtaskResult } from './Subtask'
import { wrapResult } from './wrapResult'

class Automat {
  process: Process
  debug: boolean

  constructor(process: Process, debug = false) {
    this.process = process
    this.debug = debug
  }

  public startProcess = async (initialData: any) => {
    const type = this.process.attributes.type
    const version = this.process.attributes.version
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
      taskState: {},
      state: {},
      input: initialData,
      output: null,
      error: null,
      tags: [],
      active: null,
      caller: null,
      subProcesses: [],
    }

    return this.step(initState)
  }

  public step = async (state: ProcessStateType): Promise<ProcessStateType> => {
    const task = this.process.getNode(state.currentTask)

    try {
      if (!state.currentTask || !state.currentSubtask) {
        throw new Error('Recieved state without clear target')
      }
      const rawResult = await task[state.currentSubtask]({ ...state })
      const result = this.getResult(task, rawResult)

      let status: string
      if (!result.nextSubtask && task.type === 'end') {
        status = 'finished'
      } else if (result.pause) {
        status = 'waiting'
      } else {
        status = 'running'
      }

      return {
        ...state,
        nextTask: result.nextTask,
        nextSubtask: result.nextSubtask,
        nextDeployTime: result.deployTime,
        state: { ...state.state, ...result.state },
        taskState: result.isNewTask ? {} : { ...state.taskState, ...result.taskState },
        subProcesses: [...state.subProcesses, ...(result.subProcesses || [])],
        currentInput: null,
        status,
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
    const result = wrapResult(rawResult)

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
