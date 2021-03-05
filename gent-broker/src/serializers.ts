import { Process, ProcessInput, ProcessError, Worker } from './proto/model_pb'
import { ProcessStateType } from './Types'

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
  result.setError(processErrorFromObject(i.error || ({} as any)))
  result.setTagsList(i.tags)

  return result
}

export function processToObject(i: Process): ProcessStateType {
  const error = i.getError().toObject()
  const taskState = i.getTaskState()
  const currentInput = i.getCurrentInput()
  const state = i.getState()
  const input = i.getInput()
  const output = i.getOutput()
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
    error: error.name ? error : null,
    tags: i.getTagsList(),
  }
}

export function processInputFromObject(input: ProcessInput.AsObject) {
  const result = new ProcessInput()

  result.setCaller(input.caller)
  result.setType(input.type)
  result.setVersion(input.version)
  result.setInput(input.input)

  return result
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
