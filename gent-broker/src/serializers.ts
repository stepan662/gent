import { Process, ProcessInput, ProcessError, Worker } from './proto/model_pb'

export function processFromObject(input: Process.AsObject) {
  const result = new Process()

  result.setId(input.id)
  result.setCreated(input.created)
  result.setType(input.type)
  result.setActive(input.active)
  result.setVersion(input.version)
  result.setStatus(input.status)
  result.setCurrentTask(input.currentTask)
  result.setCurrentSubtask(input.currentSubtask)
  result.setCurrentInput(input.currentInput)
  result.setNextDeployTime(input.nextDeployTime)
  result.setNextTask(input.nextTask)
  result.setNextSubtask(input.nextSubtask)
  result.setTaskState(input.taskState)
  result.setState(input.state)
  result.setInput(input.input)
  result.setOutput(input.output)
  result.setError(processErrorFromObject(input.error))
  result.setTagsList(input.tagsList)

  return result
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
