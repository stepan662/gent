import { ProcessStateType } from './Types'
import { updateContextState } from './Context'
import { workerNamespace } from './Worker'
import Process from './Process'

const scopedChanges = (scope: string, changes: { [path: string]: any }) => {
  const scopedChanges = {}
  Object.entries(changes).forEach(([path, value]) => {
    scopedChanges[scope + '.' + path] = value
  })
  return scopedChanges
}

export const _gentUpdateProcessState = (changes: { [path: string]: any }): void => {
  const context = workerNamespace.get('context')
  updateContextState(context, changes)
}

export const _gentGetProcessState = (): ProcessStateType => {
  return workerNamespace.get('context').state
}

export const gentGetState = (): any => {
  return _gentGetProcessState().task_state
}

export const gentSetState = (data) => {
  _gentUpdateProcessState({ [`task_state`]: data })
}

export const gentGetOutputs = (): { [taskId: string]: any } => {
  const state = _gentGetProcessState()
  return state.outputs
}

export const gentUpdateState = (changes: { [path: string]: any }) => {
  _gentUpdateProcessState(scopedChanges(`task_state`, changes))
}

export const gentUpdateTags = (tags: { [key: string]: string }) => {
  _gentUpdateProcessState(scopedChanges('tags', tags))
}

export const gentGetTags = () => {
  return _gentGetProcessState().tags
}

export const gentGetProcess = (): Process => {
  return workerNamespace.get('context').process
}

export const gentGetProcessId = (): string => {
  return _gentGetProcessState().id
}
