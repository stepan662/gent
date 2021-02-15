import { Process, ProcessInput } from './proto/model_pb'

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
  result.setCurrentState(input.currentState)
  result.setCurrentInput(input.currentInput)
  result.setCurrentDeployTime(input.currentDeployTime)
  result.setState(input.state)
  result.setInput(input.input)
  result.setOutput(input.output)
  result.setError(input.error)
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
