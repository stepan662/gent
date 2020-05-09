import { createNamespace } from 'continuation-local-storage'

import {
  ModifierType,
  ProcessStateType,
  ProcessEventType,
  ProcessContextType,
  ProcessErrorType,
} from './Types'

import Process from './Process'
import * as ctx from './Context'
import { squashMutations } from './Journal'
import { SubtaskResult, Subtask } from './Subtask'

// setup session so it's accessible from anywhere
export const automatNamespace = createNamespace('gent_context')

class Automat {
  process: Process
  modifier: ModifierType
  debug: boolean

  constructor(process: Process, modifier: ModifierType, debug = false) {
    this.process = process
    this.modifier = modifier
    this.debug = debug
  }

  private initContext = (state: ProcessStateType): ProcessContextType => {
    return { state, process: this.process, journal: [] }
  }

  public async initProcess(initialData: any) {
    // standard process initial state
    const start = this.process.nodes[0]

    const initialState: ProcessStateType = {
      id: null,
      created: null,
      type: this.process.attributes.id,
      task: start._id,
      subtask: null,
      status: 'running',
      task_state: null,
      tags: {},
      outputs: {},
      current_event: null,
      events: [],
    }

    let context = this.initContext(initialState)

    // let process.attributes.init to modify output or process state
    const result = await ctx.runWithContext(
      context,
      automatNamespace,
      this.process.attributes.init,
      [initialData],
    )

    const taskId = this.findNextTaskId(start._id)

    ctx.updateContextState(context, { [`outputs.start`]: result })
    ctx.updateContextState(context, { created: Date.now() })

    ctx.addEvent(context, { task: taskId, subtask: null })

    // create inital state in db
    const state = await this.modifier.createProcess(context.state)

    await this.emittNotifier(state)

    return state
  }

  public async runReadSubtask(processId: string, taskId: string, subtaskId: string, attrs: any[]) {
    const state = await this.modifier.getProcess(processId)
    if (!state) {
      throw Error(`Process ${processId} not found`)
    }

    // check if the process is in correct state
    if (state.status !== 'waiting' || state.task !== taskId) {
      throw Error(
        `Cannot resolve '${taskId}.${subtaskId}' when current is ${state.task} and status ${state.status}`,
      )
    }

    // setup context
    let context = this.initContext(state)

    const subtask = this.getSubtask(taskId, subtaskId)

    const result: SubtaskResult = await ctx.runWithContext(
      context,
      automatNamespace,
      subtask.func,
      attrs,
    )

    return result.output
  }

  public async runAsyncSubtask(
    processId: string,
    taskId: string,
    subtaskId: string,
    attrs: any[],
  ): Promise<{ state: ProcessStateType; output: any }> {
    const state = await this.modifier.getProcess(processId)
    if (!state) {
      throw Error(`Process ${processId} not found`)
    }

    // check if the process is in correct state
    if (state.status !== 'waiting' || state.task !== taskId) {
      throw Error(
        `Cannot resolve '${taskId}.${subtaskId}' when current is ${state.task} and state ${state.status}`,
      )
    }

    // there are planned events (like timeout)
    // we will need this info to predict if there wasn't a conflict
    const somethingPlanned = state.events.length > 0

    // setup context
    let context = this.initContext(state)

    // there is subtaskId - so we know what to do
    ctx.updateContextState(context, {
      subtask: subtaskId,
    })

    let result = await this.executeSubtask(context, taskId, subtaskId, attrs)

    // get and remove notifier if there was something planned
    const notifier = await this.modifier.getAndDeleteNotifier({
      process_id: processId,
    })
    if (somethingPlanned && !notifier) {
      // fail if there is no notifier
      throw new Error('Process in unexpected state (no notifier even though, there shuld be one)')
    }
    if (!somethingPlanned && notifier) {
      // fail if there is a notifier
      throw new Error(
        "Process in unexpected state (there is a notifier even though there shouldn't be)",
      )
    }
    await this.pushProcessState(context, `${taskId}.${subtaskId}.${context.state.status}`)
    await this.emittNotifier(context.state)

    return {
      state: context.state,
      output: result.output,
    }
  }

  public async emittNotifier(state: ProcessStateType) {
    const futureEvents = state.events

    if (futureEvents.length > 0 && state.status !== 'error') {
      this.debug && console.log(new Date().toISOString(), 'emmit_notifier'.padEnd(20))
      const deployTime = futureEvents[0].deploy_time
      await this.modifier.addNotifier({
        process_type: this.process.attributes.id,
        process_id: state.id,
        deploy_time: deployTime,
      })
    }
  }

  public async runWhilePossible(processId) {
    let state = await this.modifier.getProcess(processId)

    // run first task without checking delay
    state = await this.runSyncStep(state, false)
    while (state.status === 'running' && state.events.length > 0 && !state.events[0].deploy_time) {
      // keep running until stopped or event have delay
      state = await this.runSyncStep(state, false)
    }
    await this.emittNotifier(state)
    return state
  }

  public poll(interval: number, optimized: boolean = false) {
    setInterval(async () => {
      const notifier = await this.modifier.getAndDeleteNotifier({
        process_type: this.process.attributes.id,
        active: true,
      })
      if (notifier) {
        if (optimized) {
          await this.runWhilePossible(notifier.process_id)
        } else {
          const state = await this.modifier.getProcess(notifier.process_id)
          await this.runSyncStep(state)
        }
      }
    }, interval)
  }

  public async runSyncStep(state: ProcessStateType, emmitNotifier: boolean = true) {
    const currentEvent = state.events[0]

    if (!currentEvent) {
      throw new Error(`Events array is empty`)
    }

    const context = this.initContext(state)

    ctx.updateContextState(context, { current_event: currentEvent })
    ctx.removeCurrentEvent(context)

    const { taskId, subtaskId } = this.unwrapEvent(currentEvent)

    const task = this.process.getNode(taskId)

    if (currentEvent.subtask === null) {
      // this means, that this is start of the task

      // set new task id prepare state
      ctx.updateContextState(context, {
        task: taskId,
        subtask: null,
      })

      // init state
      ctx.updateContextState(context, {
        task_state: {},
      })

      // setup timeout if exists
      const connection = this.process.getNextConnections(task, 'timeout')[0]
      if (connection) {
        // @ts-ignore
        const timeout = connection.timeout
        ctx.addEvent(context, { task: taskId, subtask: '@timeout', delay: timeout })
      }
    }

    await this.pushProcessState(context, `${taskId}.${subtaskId}.start`)

    let unhandledError = null

    try {
      await this.runSyncSubtask(context, currentEvent)
    } catch (err) {
      const error = this.createError(err)

      if (this.errorFindNext(taskId, error)) {
        // there is error handler
        try {
          await this.handleError(context, currentEvent, error)
        } catch (e) {
          // fail in error handler
          unhandledError = e
        }
      } else {
        unhandledError = error
      }
    }

    if (!unhandledError) {
      // cleanup current event
      ctx.updateContextState(context, { current_event: null })

      await this.pushProcessState(context, `${taskId}.${subtaskId}.${context.state.status}`)
      if (emmitNotifier) {
        await this.emittNotifier(context.state)
      }
    } else {
      // stop the process in case of error
      ctx.updateContextState(context, {
        error: unhandledError,
        status: 'error',
      })
      await this.pushProcessState(context, `${taskId}.${subtaskId}.error`)
    }

    return context.state
  }

  // execute subtask and update state according to result
  private async executeSubtask(
    context: ProcessContextType,
    taskId: string,
    subtaskId: string,
    attrs?: any[],
  ): Promise<SubtaskResult> {
    ctx.updateContextState(context, {
      subtask: subtaskId,
    })

    const subtask = this.getSubtask(taskId, subtaskId)

    const result: SubtaskResult = await ctx.runWithContext(
      context,
      automatNamespace,
      subtask.func,
      attrs,
    )

    if (result.output && !result.nextSubtask && !result.pause) {
      // set task output
      ctx.updateContextState(context, {
        [`outputs.${taskId}`]: result.output,
      })
    }

    const next = this.nextBySubtaskResult(taskId, result)

    if (next) {
      if (next.finish) {
        // cleanup async events related to this task, when finishing
        this.cleanUpAfterTaskFinish(context, taskId)
      }
      ctx.updateContextState(context, {
        status: 'running',
      })

      ctx.addEvent(context, { task: next.task, subtask: next.subtask, delay: next.delay })
    } else {
      // process explicitly paused
      ctx.updateContextState(context, {
        status: 'waiting',
      })
    }

    return result
  }

  private async runSyncSubtask(context: ProcessContextType, event: ProcessEventType) {
    const { taskId, subtaskId } = this.unwrapEvent(event)

    const node = this.process.getNode(taskId)

    const subtask = subtaskId ? this.getSubtask(taskId, subtaskId) : null

    if (subtask !== null && subtask.type === 'sync') {
      // executable subtasks
      // execute them and decide what will be the next (task or subtask)
      await this.executeSubtask(context, taskId, subtaskId)
    } else if (node.type === 'end') {
      // end task - finish the process
      ctx.updateContextState(context, {
        status: 'finished',
        subtask: null,
      })
    } else {
      // external subtask - pause the process and wait for resolution
      ctx.updateContextState(context, {
        status: 'waiting',
        subtask: null,
      })
    }
  }

  private async handleError(
    context: ProcessContextType,
    event: ProcessEventType,
    error: ProcessErrorType,
  ) {
    const { task, subtask } = this.errorFindNext(event.task, error)

    ctx.addEvent(context, { task, subtask, data: error })
  }

  private unwrapEvent(event: ProcessEventType) {
    return {
      taskId: event.task,
      subtaskId: event.subtask || this.getFirstSubtask(event.task),
    }
  }

  private async pushProcessState(context: ProcessContextType, message) {
    const mutation = squashMutations(context.state, context.journal)
    mutation.message = message

    if (this.debug) {
      const { task, subtask, status } = context.state
      this.debug &&
        console.log(new Date().toISOString(), 'push_state'.padEnd(20), task, subtask, status)
    }
    context.state = await this.modifier.updateProcess(context.state, mutation)
    await this.modifier.addJournalEntry({ ...mutation, process_id: context.state.id })
    context.journal = []
  }

  private nextBySubtaskResult(
    currentTaskId: string,
    result: SubtaskResult,
  ): { task: string; subtask: string; delay: number; finish: boolean } | null {
    if (result.pause) {
      // if pause is defined - pause the process
      return null
    } else if (result.nextTask) {
      const node = this.process.getNode(currentTaskId)
      if (!this.process.getNextConnections(node).find((c) => c.to === result.nextTask)) {
        // there is no connection between these nodes - throw error
        throw new Error(
          `Trying to go from '${currentTaskId}' to ${result.nextTask}, but there is no connection`,
        )
      }
      // force next task from result - result of exclusive
      return {
        task: result.nextTask,
        subtask: null,
        delay: result.delay,
        finish: true,
      }
    } else if (result.nextSubtask) {
      // go to next subtask
      return {
        task: currentTaskId,
        subtask: result.nextSubtask,
        delay: result.delay,
        finish: false,
      }
    } else {
      // if neither task or subtask is specified - continue to next task
      return {
        task: this.findNextTaskId(currentTaskId),
        subtask: null,
        delay: result.delay,
        finish: true,
      }
    }
  }

  private cleanUpAfterTaskFinish(context: ProcessContextType, taskId: string) {
    // remove process state
    ctx.updateContextState(context, {
      [`task_state`]: null,
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
    if (!task) {
      throw new Error(`Task '${nodeId}' doesn't exists`)
    }
    // @ts-ignore
    return task._first || null
  }

  private getSubtask(taskId: string, subtaskId: string): Subtask {
    const task = this.process.getNode(taskId)
    let subtask
    if (subtaskId.startsWith('@') && task) {
      const connection = this.process.getNextConnections(task, 'timeout')[0]
      // @ts-ignore
      subtask = connection?.exec
    } else {
      subtask = task?.[subtaskId]
    }

    if (!subtask) {
      throw new Error(`Couldn't find ${taskId}.${subtaskId}`)
    }

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
      } else if (connection.error) {
        return connection.error === error.name
      }
      return true
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

export default Automat
