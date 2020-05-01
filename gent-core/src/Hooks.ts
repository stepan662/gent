import { ProcessStateType } from './Types'
import { updateContextState } from './Context'
import { automatNamespace } from './Automat'
import Process from './Process'

const scopedChanges = (scope: string, changes: { [path: string]: any }) => {
  const scopedChanges = {}
  Object.entries(changes).forEach(([path, value]) => {
    scopedChanges[scope + '.' + path] = value
  })
  return scopedChanges
}

const __gentUpdateProcessState = (changes: { [path: string]: any }): void => {
  const context = automatNamespace.get('context')
  updateContextState(context, changes)
}

const __gentGetProcessState = (): ProcessStateType => {
  return automatNamespace.get('context').state
}

export const gentGetState = (): any => {
  return __gentGetProcessState().task_state
}

export const gentSetState = (data) => {
  __gentUpdateProcessState({ [`task_state`]: data })
}

export const gentGetOutputs = (): { [taskId: string]: any } => {
  const state = __gentGetProcessState()
  return state.outputs
}

export const gentUpdateState = (changes: { [path: string]: any }) => {
  __gentUpdateProcessState(scopedChanges(`task_state`, changes))
}

export const gentUpdateTags = (tags: { [key: string]: string }) => {
  __gentUpdateProcessState(scopedChanges('tags', tags))
}

export const gentGetTags = () => {
  return __gentGetProcessState().tags
}

export const gentGetProcess = (): Process => {
  return automatNamespace.get('context').process
}

export const gentGetStatus = () => {
  return __gentGetProcessState().status
}

export const gentGetTaskInfo = () => {
  const { error, task, subtask, status } = __gentGetProcessState()
  return { error, task, subtask, status }
}

export const gentGetProcessInfo = () => {
  const { id, type } = __gentGetProcessState()
  return { id, type }
}

export const gentGetCurrentEvent = () => {
  return __gentGetProcessState().current_event
}

export const gentGetProcessId = (): string => {
  return __gentGetProcessState().id
}
