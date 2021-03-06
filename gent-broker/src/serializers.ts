import {
  Process,
  ProcessError,
  Worker,
  ExternalAction,
  ProcessInput,
  ProcessIdentity,
  ProcessExternalResponse,
} from './proto/model_pb'
import { ExternalActionType, ProcessStateType } from './Types'

export function processFromObject(i: ProcessStateType) {
  const result = new Process()

  result.setId(i.id)
  result.setCreated(i.created)
  result.setType(i.type)
  result.setActive(i.active)
  result.setVersion(i.version)
  result.setStatus(i.status)
  result.setCurrentTask(i.currentTask)
  result.setCurrentSubtask(i.currentSubtask)
  i.taskState && result.setTaskState(JSON.stringify(i.taskState))
  i.currentInput && result.setCurrentInput(JSON.stringify(i.currentInput))
  result.setNextDeployTime(i.nextDeployTime)
  result.setNextTask(i.nextTask)
  result.setNextSubtask(i.nextSubtask)
  i.state && result.setState(JSON.stringify(i.state))
  i.input && result.setInput(JSON.stringify(i.input))
  i.output && result.setOutput(JSON.stringify(i.output))
  if (i.error) {
    result.setError(processErrorFromObject(i.error))
  }
  result.setTagsList(i.tags)
  if (i.caller) {
    result.setCaller(processIdentityFromObject(i.caller))
  }
  result.setActionsList(i.actions && i.actions.map(externalActionFromObject))

  return result
}

export function processToObject(i: Process): ProcessStateType {
  const error = i.getError()?.toObject()
  const taskState = i.getTaskState()
  const currentInput = i.getCurrentInput()
  const state = i.getState()
  const input = i.getInput()
  const output = i.getOutput()
  const caller = i.getCaller()?.toObject()
  return {
    id: i.getId(),
    created: i.getCreated(),
    type: i.getType(),
    active: i.getActive(),
    version: i.getVersion(),
    status: i.getStatus(),
    currentTask: i.getCurrentTask(),
    currentSubtask: i.getCurrentSubtask(),
    taskState: taskState && JSON.parse(taskState),
    currentInput: currentInput && JSON.parse(currentInput),
    nextDeployTime: i.getNextDeployTime(),
    nextTask: i.getNextTask(),
    nextSubtask: i.getNextSubtask(),
    state: state && JSON.parse(state),
    input: input && JSON.parse(input),
    output: output && JSON.parse(output),
    error: error || null,
    tags: i.getTagsList(),
    caller: caller || null,
    actions: i.getActionsList() && i.getActionsList().map(externalActionToObject),
  }
}

export function externalActionToObject(input: ExternalAction): ExternalActionType {
  if (input.hasProcessStart()) {
    return {
      type: 'processStart',
      data: input.getProcessStart().toObject(),
    }
  } else {
    return {
      type: 'processResponse',
      data: input.getProcessResponse().toObject(),
    }
  }
}

export function externalActionFromObject(i: ExternalActionType): ExternalAction {
  const result = new ExternalAction()
  if (i.type === 'processStart') {
    const p = new ProcessInput()
    if (i.data.caller) {
      p.setType(i.data.type)
      p.setVersion(i.data.version)
      p.setCaller(processIdentityFromObject(i.data.caller))
    }
    p.setInput(i.data.input)
    result.setProcessStart(p)
  } else {
    const r = new ProcessExternalResponse()
    if (i.data.caller) {
      r.setCaller(processIdentityFromObject(i.data.caller))
    }
    r.setOutput(i.data.output)
    r.setStatus(i.data.status)
    result.setProcessResponse(r)
  }

  return result
}

export function processIdentityFromObject(i: ProcessIdentity.AsObject): ProcessIdentity {
  const c = new ProcessIdentity()
  c.setId(i.id)
  c.setType(i.type)
  c.setVersion(i.version)
  c.setTask(i.task)
  c.setSubtask(i.subtask)
  c.setSubprocess(i.subprocess)
  return c
}

export function workerFromObject(input: Worker.AsObject) {
  const result = new Worker()

  result.setType(input.type)
  result.setVersion(input.version)

  return result
}

export function processErrorFromObject(input: ProcessError.AsObject) {
  const result = new ProcessError()

  result.setName(input.name)
  result.setMessage(input.message)
  result.setStack(input.stack)

  return result
}
