import { LinkType, StartType, EndType, TaskType, ExclusiveType } from './Types'
import { SubtaskType } from './Subtask'

type ElementInput = {
  id?: string
  name?: string
  description?: string
}

type LinkInputType = ElementInput

type TaskInput = ElementInput & {
  run: SubtaskType
}
export const task = (props?: TaskInput): TaskType => {
  return {
    _first: 'run',
    ...props,
    type: 'task',
  }
}

export const link = (props?: LinkInputType): LinkType => {
  return {
    ...props,
    type: 'link',
  }
}

type StartInput = ElementInput & {
  init: SubtaskType
}
export const start = (props?: StartInput): StartType => {
  return {
    id: 'start',
    _first: 'init',
    ...props,
    type: 'start',
  }
}

export const end = (props?: ElementInput): EndType => {
  return {
    _first: 'finish',
    finish: () => {},
    ...props,
    type: 'end',
  }
}

type ExclusiveInput = ElementInput & {
  decide: SubtaskType
}
export const exclusive = (props?: ExclusiveInput): ExclusiveType => {
  return {
    _first: 'decide',
    ...props,
    type: 'exclusive',
  }
}
