import { createNamespace } from 'continuation-local-storage'

import {
  ModifierType,
  ProcessStateType,
  ProcessEventType,
  SubtaskType,
  ProcessContextType,
  SubtaskResultType,
  ProcessErrorType,
} from './Types'
import Process from './Process'
import * as ctx from './Context'
import { squashMutations } from './Journal'

// setup session so it's accessible from anywhere
export const workerNamespace = createNamespace('gent_context')

class Worker {
  process: Process
  modifier: ModifierType

  constructor(process: Process, modifier: ModifierType) {
    this.process = process
    this.modifier = modifier
  }

  private initContext = (state: ProcessStateType): ProcessContextType => {
    return { state, process: this.process, journal: [] }
  }

  public async initProcess(initialData: any) {
    // standard process initial state
    const start = this.process.nodes[0]

    const initialState: ProcessStateType = {
      id: null,
      tags: {},
      outputs: {},
      current: {
        task: start._id,
        subtask: null,
        status: 'running',
        task_state: null,
      },
      events: [],
    }

    let context = this.initContext(initialState)

    // let process.attributes.init to modify output or process state
    const result = await ctx.runWithContext(
      context,
      workerNamespace,
      this.process.attributes.init,
      [initialData],
    )

    const taskId = this.findNextTaskId(start._id)

    ctx.updateContextState(context, { [`outputs.start`]: result })

    ctx.addEvent(context, { task: taskId, subtask: null })

    // create inital state in db
    const state = await this.modifier.createProcess(context.state)

    await this.emittNotifier(state)

    return state
  }

  public async handleReadTask(processId: string, taskId: string, subtaskId: string, attrs: any[]) {
    const state = await this.modifier.getProcess(processId)
    if (!state) {
      throw Error(`Process ${processId} not found`)
    }
    const current = state.current

    // check if the process is in correct state
    if (current.status !== 'waiting' || current.task !== taskId) {
      throw Error(
        `Cannot resolve '${taskId}.${subtaskId}' when current is ${current.task} and status ${current.status}`,
      )
    }

    // setup context
    let context = this.initContext(state)

    const subtask = this.getSubtaskId(taskId, subtaskId)

    const result: SubtaskResultType = await ctx.runWithContext(
      context,
      workerNamespace,
      subtask.func,
      attrs,
    )

    return result.output
  }

  public async handleExternalTask(
    processId: string,
    taskId: string,
    subtaskId: string,
    attrs: any[],
  ): Promise<{ state: ProcessStateType; output: any }> {
    const state = await this.modifier.getProcess(processId)
    if (!state) {
      throw Error(`Process ${processId} not found`)
    }
    const current = state.current

    // check if the process is in correct state
    if (current.status !== 'waiting' || current.task !== taskId) {
      throw Error(
        `Cannot resolve '${taskId}.${subtaskId}' when current is ${current.task} and state ${current.status}`,
      )
    }

    // if we resolve task on which the process is stuck on,
    // then we resume the process, otherwise just execute the task
    const resumeProcess = current.subtask === subtaskId

    // remove notifier, so we postpone timed tasks (if there are any)
    await this.modifier.getAndDeleteNotifier({
      process_id: processId,
    })

    // setup context
    let context = this.initContext(state)

    let result: SubtaskResultType
    try {
      result = await this.executeSubtask(context, taskId, subtaskId, attrs, resumeProcess)
    } catch (e) {
      // when error - emmit notifier back
      await this.emittNotifier(context.state)
      throw e
    }

    if (resumeProcess) {
      // plan next task and resume process
      const next = this.nextBySubtaskResult(taskId, result)

      if (next.subtask === null) {
        // cleanup async events related to this task, when finishing
        this.cleanupAfterTaskFinished(context, taskId)
      }

      ctx.addEvent(context, next)

      // when success - update process state and emmit notifier
      ctx.updateContextState(context, { 'current.status': 'running' })
    }

    await this.pushProcessState(context, `${taskId}.${subtaskId}.${context.state.current.status}`)
    await this.emittNotifier(context.state)

    return {
      state: context.state,
      output: result.output,
    }
  }

  public async emittNotifier(state: ProcessStateType) {
    const futureEvents = state.events

    if (futureEvents.length) {
      const deployTime = futureEvents[0].deploy_time
      await this.modifier.addNotifier({
        process_type: this.process.attributes.id,
        process_id: state.id,
        deploy_time: deployTime,
      })
    }
  }

  // execute subtask and update state according to result
  private async executeSubtask(
    context: ProcessContextType,
    taskId: string,
    subtaskId: string,
    attrs?: any[],
    setOutput: boolean = true,
  ): Promise<SubtaskResultType> {
    const subtask = this.getSubtaskId(taskId, subtaskId)

    const result: SubtaskResultType = await ctx.runWithContext(
      context,
      workerNamespace,
      subtask.func,
      attrs,
    )

    if (result.output && setOutput) {
      // set task output
      ctx.updateContextState(context, {
        [`outputs.${taskId}`]: result.output,
      })
    }

    return result
  }

  private async handleTask(context: ProcessContextType, event: ProcessEventType) {
    const { task: taskId, subtask: subtaskId } = this.unwrapEvent(event)
    const task = this.process.getNode(taskId)

    if (event.subtask === null) {
      // setup timeout if exists
      const connection = this.process.getNextConnections(task, 'timeout')[0]
      if (connection) {
        // @ts-ignore
        const timeout = connection.timeout
        ctx.addEvent(context, { task: taskId, subtask: 'timeout', delay: timeout })
      }
    }

    // initialize task state if it doesn't exists
    if (!context.state.current.task_state) {
      ctx.updateContextState(context, {
        'current.task_state': {},
      })
    }

    const subtask = this.getSubtaskId(taskId, subtaskId)

    if (!subtask.external) {
      // executable subtasks
      // execute them and decide what will be the next (task or subtask)
      const result = await this.executeSubtask(context, taskId, subtaskId)

      const next = this.nextBySubtaskResult(taskId, result)

      if (next.subtask === null) {
        // cleanup async events related to this task, when finishing
        this.cleanupAfterTaskFinished(context, taskId)
      }

      ctx.addEvent(context, next)
    } else {
      // external subtasks - pause the process and wait for resolution
      ctx.updateContextState(context, {
        'current.status': 'waiting',
      })
    }
  }

  private async handleEnd(context: ProcessContextType, event: ProcessEventType) {
    ctx.updateContextState(context, { 'current.status': 'finished' })
  }

  private async handleError(
    context: ProcessContextType,
    event: ProcessEventType,
    error: ProcessErrorType,
  ) {
    const { task, subtask } = this.errorFindNext(event.task, error)

    ctx.addEvent(context, { task, subtask, data: error })
  }

  public async step(state: ProcessStateType) {
    const event = state.events[0]
    if (!event) {
      return
    }

    let context = this.initContext(state)

    const { task, subtask } = this.unwrapEvent(event)

    console.log(new Date().toISOString(), task, subtask, 'start')

    // update state, so current task and subtask
    ctx.updateContextState(context, {
      'current.task': task,
      'current.subtask': subtask,
    })

    if (context.state.current.status !== 'running') {
      ctx.updateContextState(context, {
        'current.status': 'running',
      })
    }

    await this.pushProcessState(context, `${task}.${subtask}.start`)

    const node = this.process.getNode(task)

    let unhandledError = null

    try {
      switch (node.type) {
        case 'task':
        case 'exclusive':
          await this.handleTask(context, event)
          break

        case 'end':
          await this.handleEnd(context, event)
          break

        default:
          throw new Error(`Unknown node type '${node.type}'`)
      }
    } catch (err) {
      const error = this.createError(err)

      if (this.errorFindNext(task, error)) {
        // there is error handler
        await this.handleError(context, event, error)
      } else {
        unhandledError = error
      }
    }

    if (!unhandledError) {
      // remove current event, store state and setup notifier
      ctx.removeCurrentEvent(context, event)
      await this.pushProcessState(context, `${task}.${subtask}.${context.state.current.status}`)
      await this.emittNotifier(context.state)
    } else {
      // stop the process in case of error
      ctx.updateContextState(context, {
        'current.error': unhandledError,
        'current.status': 'error',
      })
      await this.pushProcessState(context, `${task}.${subtask}.error`)
    }

    console.log(new Date().toISOString(), task, subtask, context.state.current.status)

    return context.state
  }

  public poll(interval: number) {
    setInterval(async () => {
      const notifier = await this.modifier.getAndDeleteNotifier({
        process_type: this.process.attributes.id,
        active: true,
      })
      if (notifier) {
        const state = await this.modifier.getProcess(notifier.process_id)
        await this.step(state)
      }
    }, interval)
  }

  private unwrapEvent(event: ProcessEventType) {
    return {
      task: event.task,
      subtask: event.subtask || this.getFirstSubtask(event.task),
    }
  }

  private async pushProcessState(context: ProcessContextType, message) {
    const mutation = squashMutations(context.state, context.journal)
    mutation.message = message
    await this.modifier.updateProcess(context.state)
    await this.modifier.addJournalEntry({ ...mutation, process_id: context.state.id })
    context.journal = []
  }

  private nextBySubtaskResult(
    currentTaskId: string,
    result: SubtaskResultType,
  ): { task: string; subtask: string } {
    if (result.next_task) {
      return {
        task: result.next_task,
        subtask: null,
      }
    } else if (result.next_subtask) {
      return {
        task: currentTaskId,
        subtask: result.next_subtask,
      }
    } else {
      return {
        task: this.findNextTaskId(currentTaskId),
        subtask: null,
      }
    }
  }

  private cleanupAfterTaskFinished(context: ProcessContextType, taskId: string) {
    // remove process state
    ctx.updateContextState(context, {
      [`current.task_state`]: null,
    })
    // remove all future events related to this task
    ctx.updateContextState(context, {
      events: context.state.events.filter((e) => e.task !== taskId),
    })
  }

  private findNextTaskId(nodeId: string) {
    const node = this.process.getNode(nodeId)
    const nextNode = this.process.nextNode(node)
    return nextNode?._id
  }

  private getFirstSubtask(nodeId: string) {
    const task = this.process.getNode(nodeId)
    // @ts-ignore
    return task._first || 'run'
  }

  private getSubtaskId(taskId, subtaskId) {
    const task = this.process.getNode(taskId)
    const subtask: SubtaskType = task[subtaskId]
    return subtask
  }

  private errorFindNext(nodeId: string, error: ProcessErrorType) {
    const node = this.process.getNode(nodeId)
    const connections = this.process.getNextConnections(node, 'error') as any[]

    const errHandler = connections.find((connection) => {
      if (Array.isArray(connection.error)) {
        return connection.error.includes(error.name)
      } else if (typeof connection.error === 'function') {
        return connection.error(error)
      } else {
        return connection.error === error.name
      }
    })

    if (errHandler) {
      return { task: errHandler.to, subtask: null }
    }
  }

  private createError = (err: Error): ProcessErrorType => {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
    }
  }
}

export default Worker
