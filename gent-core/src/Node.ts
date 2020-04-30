import { gentGetProcess, _gentGetProcessState, gentGetOutputs } from './Hooks'

import {
  TaskType,
  LinkType,
  StartType,
  EndType,
  ExclusiveType,
  TimeoutLinkType,
  ErrorLinkType,
  ErrorCheckerInputType,
} from './Types'
import { Subtask, SubtaskResult } from './Subtask'

type ElementInput = {
  id?: string
  name?: string
  description?: string
}

type UserTaskInputType = ElementInput & {
  id: string
  resolve: (data: any) => Promise<any | SubtaskResult> | (any | SubtaskResult)
  [subTaskId: string]: Subtask | any
}

type SystemTaskInputType = ElementInput & {
  exec: () => Promise<any | SubtaskResult> | (any | SubtaskResult)
  [subTaskId: string]: Subtask | any
}

type ExclusiveInputType = ElementInput & {
  decide: (results: { [taskId: string]: any }) => Promise<string> | string
}

type LinkInputType = ElementInput

type ErrorLinkInputType = ElementInput & {
  error?: ErrorCheckerInputType
}

type TimeoutLinkInputType = ElementInput & {
  timeout: number
  exec?: () => Promise<any | SubtaskResult> | (any | SubtaskResult)
}

export const subtaskResultOrDefault = (
  result: SubtaskResult | any,
  defaultResult?: SubtaskResult,
) => {
  if (result instanceof SubtaskResult) {
    return new SubtaskResult({
      ...defaultResult,
      ...result,
    })
  } else {
    return new SubtaskResult({
      output: result,
      ...defaultResult,
    })
  }
}

export const subtaskSync = (func: () => Promise<any>) =>
  new Subtask({
    type: 'sync',
    func: async () => {
      return subtaskResultOrDefault(await func())
    },
  })

export const subtaskAsync = (func: (data: any) => Promise<any>): Subtask =>
  new Subtask({
    type: 'async',
    func: async (data) => subtaskResultOrDefault(await func(data)),
  })

export const subtaskRead = (func: (data: any) => Promise<any> | any) =>
  new Subtask({
    type: 'read',
    func: async (data) => subtaskResultOrDefault(await func(data)),
  })

export const taskUser = (props: UserTaskInputType): TaskType => {
  const { resolve, ...standardProps } = props
  return {
    _first: 'resolve',
    ...standardProps,
    type: 'task',
    task_type: 'user_task',
    resolve: subtaskAsync(resolve),
  }
}

export const taskSystem = (props: SystemTaskInputType): TaskType => {
  const { exec, ...standardProps } = props
  return {
    _first: 'exec',
    ...standardProps,
    type: 'task',
    task_type: 'system_task',
    exec: subtaskSync(exec),
  }
}

export const exclusive = (props: ExclusiveInputType): ExclusiveType => {
  const { decide, ...standardProps } = props
  return {
    ...standardProps,
    type: 'exclusive',
    decide: subtaskSync(async () => {
      const outputs = gentGetOutputs()
      const result = await decide(outputs)
      if (!result) {
        throw new Error(`Empty result from exclusive decide, expecting task id`)
      }
      return new SubtaskResult({
        nextTask: result,
      })
    }),
    _first: 'decide',
  }
}

export const link = (props?: LinkInputType): LinkType => {
  return {
    ...props,
    type: 'link',
  }
}

export const linkError = (props?: ErrorLinkInputType): ErrorLinkType => {
  return {
    ...props,
    type: 'link',
    link_type: 'error',
  }
}

export const linkTimeout = ({ timeout, exec, ...props }: TimeoutLinkInputType): TimeoutLinkType => {
  return {
    ...props,
    timeout: timeout * 1000,
    type: 'link',
    link_type: 'timeout',
    exec: subtaskSync(async () => {
      const result = subtaskResultOrDefault(exec ? await exec() : null)
      const taskId = _gentGetProcessState().task
      const connection = gentGetProcess().connections.find(
        (c) => c.from === taskId && c.link_type === 'timeout',
      )
      return new SubtaskResult({
        ...result,
        nextTask: connection.to,
      })
    }),
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
