import { Process, ProcessError, Worker, SubProcess, Caller } from './proto/model_pb'
import { SubProcessType, ProcessStateType, CallerType } from './Types'

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
    result.setCaller(callerFromObject(i.caller))
  }
  result.setSubProcessesList(i.subProcesses && i.subProcesses.map(subProcessFromObject))

  return result
}

export function processToObject(i: Process): ProcessStateType {
  const error = i.getError()?.toObject()
  const taskState = i.getTaskState()
  const currentInput = i.getCurrentInput()
  const state = i.getState()
  const input = i.getInput()
  const output = i.getOutput()
  const caller = i.getCaller()
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
    caller: caller && callerToObject(caller),
    subProcesses: i.getSubProcessesList() && i.getSubProcessesList().map(subProcessToObject),
  }
}

export function subProcessFromObject(i: SubProcessType): SubProcess {
  const p = new SubProcess()
  p.setId(i.id)
  p.setStatus(i.status)
  p.setInput(i.input)
  p.setType(i.type)
  p.setVersion(i.version)
  p.setReply(i.reply)
  return p
}

export function subProcessToObject(i: SubProcess): SubProcessType {
  return {
    id: i.getId(),
    status: i.getStatus() as any,
    input: i.getInput(),
    type: i.getType(),
    version: i.getVersion(),
    reply: i.getReply(),
  }
}

export function callerFromObject(i: CallerType): Caller {
  const c = new Caller()
  c.setId(i.id)
  c.setType(i.type)
  c.setVersion(i.version)
  c.setTask(i.task)
  c.setSubtask(i.subtask)
  c.setReply(i.reply)
  return c
}

export function callerToObject(i: Caller): CallerType {
  return {
    id: i.getId(),
    type: i.getType(),
    version: i.getVersion(),
    task: i.getTask(),
    subtask: i.getSubtask(),
    reply: i.getReply(),
  }
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
