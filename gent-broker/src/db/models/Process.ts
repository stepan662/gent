import { db } from '../connection'
import { DataTypes } from 'sequelize'
import { ProcessStateType } from 'src/Types'

const Process = db.define('Process', {
  created: DataTypes.DATE,
  type: DataTypes.STRING,
  version: DataTypes.STRING,
  status: DataTypes.ENUM('running', 'waiting', 'error', 'finished'),
  currentTask: DataTypes.STRING,
  currentSubtask: DataTypes.STRING,
  currentInput: DataTypes.JSONB,
  nextDeployTime: DataTypes.DATE,
  nextTask: DataTypes.STRING,
  nextSubtask: DataTypes.STRING,
  taskState: DataTypes.JSONB,
  state: DataTypes.JSONB,
  input: DataTypes.JSONB,
  output: DataTypes.JSONB,
  error: DataTypes.JSONB,
  tags: DataTypes.ARRAY(DataTypes.STRING),
  caller: DataTypes.JSONB,
  subProcesses: DataTypes.ARRAY(DataTypes.JSONB),
})

export function deserializeProcess(i: any): ProcessStateType {
  return {
    id: String(i.id),
    created: i.created && new Date(i.created).getTime(),
    type: i.type,
    version: i.version,
    status: i.status,
    currentTask: i.currentTask,
    currentSubtask: i.currentSubtask,
    currentInput: i.currentInput,
    nextDeployTime: i.nextDeployTime && new Date(i.nextDeployTime).getTime(),
    nextTask: i.nextTask,
    nextSubtask: i.nextSubtask,
    taskState: i.taskState,
    state: i.state,
    input: i.input,
    output: i.output,
    error: i.error,
    tags: i.tags,
    caller: i.caller,
    subProcesses: i.subProcesses,
  }
}

export function serializeProcess(i: ProcessStateType): any {
  return {
    created: i.created && new Date(i.created),
    type: i.type,
    version: i.version,
    status: i.status,
    currentTask: i.currentTask,
    currentSubtask: i.currentSubtask,
    currentInput: i.currentInput,
    nextDeployTime: i.nextDeployTime ?? new Date(i.nextDeployTime),
    nextTask: i.nextTask,
    nextSubtask: i.nextSubtask,
    taskState: i.taskState,
    state: i.state,
    input: i.input,
    output: i.output,
    error: i.error,
    tags: i.tags,
    caller: i.caller,
    subProcesses: i.subProcesses,
  }
}

export default Process
