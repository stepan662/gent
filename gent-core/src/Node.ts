import {
  LinkType,
  StartType,
  EndType,
  TaskType,
  ExclusiveType,
  ProcessStateType,
  SubprocessType,
  SubProcessType,
} from './Types'
import { SubtaskType, SubtaskResult, SubtaskResultGeneric } from './Subtask'
import { wrapResult } from './wrapResult'

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

type EndInput = ElementInput & {
  finish?: SubtaskType
}
export const end = (props?: EndInput): EndType => {
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

type SubProcessInput = ElementInput & {
  subprocesses: {
    type: string
    version: string
    input?: any
  }[]
  onStart?: (started: SubProcessType[], process: ProcessStateType) => SubtaskResultGeneric
  onFinish?: (
    finished: SubProcessType,
    allFinished: boolean,
    process: ProcessStateType,
  ) => SubtaskResultGeneric
}
export const subProcess = (props?: SubProcessInput): SubprocessType => {
  const { subprocesses, onStart, onFinish } = props
  return {
    _first: 'run',
    run: async (subtaskProps: ProcessStateType) => {
      const { currentInput, currentSubtask, taskState, currentTask } = subtaskProps

      if (currentInput?.started) {
        const result = onStart
          ? wrapResult(await onStart(currentInput.started, subtaskProps))
          : null
        return new SubtaskResult({
          ...result,
          taskState: {
            ...result?.taskState,
            _subProcesses: currentInput.started,
          },
          nextSubtask: currentSubtask,
          pause: true,
        })
      } else if (currentInput?.finished) {
        const subProcesses = taskState._subProcesses.map((sp) =>
          sp.id === currentInput.finished.id ? currentInput.finished : sp,
        )
        const allFinished = subProcesses.every((sp) => sp.status === 'finished')

        const result = onFinish
          ? wrapResult(await onFinish(currentInput.finished, allFinished, subtaskProps))
          : null

        if (!allFinished) {
          return new SubtaskResult({
            ...result,
            taskState: {
              ...result?.taskState,
              _subProcesses: subProcesses,
            },
            nextSubtask: currentSubtask,
            pause: true,
          })
        } else {
          return new SubtaskResult({
            ...result,
            taskState: {
              ...result?.taskState,
              _subProcesses: subProcesses,
            },
          })
        }
      } else {
        return new SubtaskResult({
          subProcesses: subprocesses.map((s) => ({
            id: null,
            status: 'init',
            type: s.type,
            version: s.version,
            input: s.input,
            task: currentTask,
            reply: true,
          })),
          nextSubtask: currentSubtask,
          pause: true,
        })
      }
    },
    ...props,
    type: 'subprocess',
  }
}
