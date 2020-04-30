import { gentGetProcess, _gentGetProcessState, gentGetOutputs } from './Hooks'

import {
  TaskType,
  SubtaskType,
  LinkType,
  StartType,
  EndType,
  ExclusiveType,
  SubtaskResultType,
  ExclusiveLinkType,
  TimeoutLinkType,
  ErrorLinkType,
  ErrorCheckerInputType,
  RestMethods,
} from './Types'

type ElementInput = {
  id?: string
  name?: string
  description?: string
}

type UserTaskInputType = ElementInput & {
  id: string
  resolve: (data: any) => Promise<any> | any
  [subTaskId: string]: SubtaskType | any
}

type SystemTaskInputType = ElementInput & {
  exec: () => Promise<any>
  [subTaskId: string]: SubtaskType | any
}

type LinkInputType = ElementInput

type ExclusiveLinkInputType = ElementInput & {
  if: (results: { [taskId: string]: any }) => boolean
}

type ErrorLinkInputType = ElementInput & {
  error: ErrorCheckerInputType
}

type TimeoutLinkInputType = ElementInput & {
  timeout: number
}

export const subtaskSystem = (func: () => Promise<any>, next: string = null): SubtaskType => ({
  external: false,
  read_only: false,
  func: async (): Promise<SubtaskResultType> => {
    const output = await func()
    return {
      output,
      next_subtask: next,
    }
  },
})

export const subtaskExternal = (func: (data: any) => Promise<any>): SubtaskType => ({
  external: true,
  read_only: false,
  func: async (data): Promise<SubtaskResultType> => {
    const output = await func(data)
    return {
      output,
      next_subtask: null,
    }
  },
})

const subtaskDecideNext = (
  func: () => Promise<SubtaskResultType> | SubtaskResultType,
): SubtaskType => ({
  external: false,
  read_only: false,
  func: async (): Promise<SubtaskResultType> => {
    return func()
  },
})

export const endpoint = (
  method: RestMethods,
  func: (data: any) => Promise<any> | any,
  resultOptions?: SubtaskResultType,
): SubtaskType => ({
  external: true,
  read_only: method === 'get',
  method,
  func: async (data): Promise<SubtaskResultType> => {
    const output = await func(data)
    return {
      next_task: null,
      next_subtask: null,
      ...resultOptions,
      output,
    }
  },
})

export const baseTask: {} = {
  timeout: subtaskDecideNext(async () => {
    const currentId = _gentGetProcessState().task
    const currentTask = gentGetProcess().getNode(currentId)
    const connection = gentGetProcess().getNextConnections(currentTask, 'timeout')[0]
    if (!connection?.to) {
      throw new Error(`Timeout of ${currentTask._id} expired`)
    }
    return {
      output: null,
      next_task: connection.to,
    }
  }),
}

export const taskUser = (props: UserTaskInputType): TaskType => {
  const { resolve, ...standardProps } = props
  return {
    _first: 'resolve',
    task_type: 'user_task',
    ...baseTask,
    ...standardProps,
    type: 'task',
    resolve: subtaskExternal(resolve),
  }
}

export const taskSystem = (props: SystemTaskInputType): TaskType => {
  const { exec, ...standardProps } = props
  return {
    ...baseTask,
    ...standardProps,
    type: 'task',
    task_type: 'system_task',
    exec: subtaskSystem(exec),
    _first: 'exec',
  }
}

export const exclusive = (props?: ElementInput): ExclusiveType => {
  return {
    ...props,
    type: 'exclusive',
    run: subtaskDecideNext(async () => {
      const outputs = gentGetOutputs()
      const currentId = _gentGetProcessState().task
      const current = gentGetProcess().getNode(currentId)
      const connections = gentGetProcess().getNextConnections(current, 'exclusive')
      for (const connection of connections) {
        // @ts-ignore
        if (await connection.if(outputs)) {
          return {
            next_task: connection.to,
          }
        }
      }
      throw Error('No option matched in exclusive')
    }),
    _first: 'run',
  }
}

export const link = (props?: LinkInputType): LinkType => {
  return {
    ...props,
    type: 'link',
  }
}

export const linkExclusive = (props: ExclusiveLinkInputType): ExclusiveLinkType => {
  return {
    ...props,
    type: 'link',
    link_type: 'exclusive',
  }
}

export const linkError = (props: ErrorLinkInputType): ErrorLinkType => {
  return {
    ...props,
    type: 'link',
    link_type: 'error',
  }
}

export const linkTimeout = ({ timeout, ...props }: TimeoutLinkInputType): TimeoutLinkType => {
  return {
    ...props,
    timeout: timeout * 1000,
    type: 'link',
    link_type: 'timeout',
  }
}

export const start = (props?: ElementInput): StartType => {
  return {
    id: 'start',
    ...props,
    type: 'start',
  }
}

export const end = (props?: ElementInput): EndType => {
  return {
    ...props,
    type: 'end',
  }
}
