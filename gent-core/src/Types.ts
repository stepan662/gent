import { Subtask } from './Subtask'

export type ProcessContextType = {
  state: ProcessStateType
  journal: JournalMutationType[]
  process: any
}

/*
 *  Process state
 */
export type ProcessStateType = {
  id: string
  type: string
  task: string
  subtask: string
  status: ProcessStatusType
  task_state: any
  error?: ProcessErrorType
  tags: ProcessTagsType
  outputs: ProcessTasksType
  current_event: ProcessEventType
  events: ProcessEventType[]
}

export type ProcessStatusType = 'running' | 'waiting' | 'error' | 'finished'

export type ProcessTagsType = {
  [key: string]: string
}

export type ProcessTasksType = {
  [id: string]: any
}

export type ProcessEventType = {
  task: string
  subtask: string
  // timestamp
  created: number
  // in case it's timed task
  deploy_time?: number
  // task can contain additional data
  data?: any
}

export type ProcessErrorType = {
  name: string
  message: string
  stack?: string
}

/*
 *  Journal model
 */
export type JournalMutationType = {
  id?: string
  process_id: string
  timestamp: number
  message?: string
  prev_values: MutationSerializableType
}

export type MutationSerializableType = { [statePath: string]: { value: any } }

export type MutationType = { [statePath: string]: any }

/*
 *  Process queue events
 */

export type ProcessNotifierType = {
  process_type: string
  process_id: string
  deploy_time: number
}

export type ProcessNotifierFilterType = {
  process_type?: string
  process_id?: string
  active?: boolean
}

/*
 *  Process
 */

// base for task, link, exclusive, start, end
export type ElementType = {
  _id?: string
  id?: string
  name?: string
  description?: string
  type: 'link' | 'start' | 'end' | 'exclusive' | 'task'
}

export type LinkTypeType = 'error' | 'timeout' | undefined

export type LinkType = ElementType & {
  type: 'link'
  link_type?: LinkTypeType
}

export type ErrorCheckerInputType = string | string[] | ((e: ProcessErrorType) => boolean)

export type ErrorLinkType = LinkType & {
  link_type: 'error'
  error?: ErrorCheckerInputType
}

export type TimeoutLinkType = LinkType & {
  link_type: 'timeout'
  timeout: number
  exec: Subtask
}

export type StartType = ElementType & {
  type: 'start'
}

export type EndType = ElementType & {
  type: 'end'
}

export type ExclusiveType = ElementType & {
  _first?: string
  type: 'exclusive'
  decide: Subtask
}

export type TaskType = ElementType & {
  _first?: string
  type: 'task'
  task_type: string
  [subtaskId: string]: Subtask | string
}

export type NodeType = StartType | EndType | ExclusiveType | TaskType

/*
 * Executable process structure
 */
export interface ProcessType {
  nodes: NodeType[]
  connections: Connection[]
  attributes: ProcessAttributes
  getSchema(): any
}

export type Connection = LinkType & {
  from: string
  to: string
}

export type ProcessAttributes = {
  id: string
  name?: string
  description?: string
  init: (initialData: any) => Promise<any>
}

/*
 * Db resources interface
 */

export type ProcessResourceType = {
  key: string
  value: any
}

/*
 * Db modifier interface
 */

export interface ModifierType {
  createProcess(process: ProcessStateType): Promise<ProcessStateType>

  updateProcess(process: ProcessStateType, changes: JournalMutationType): Promise<ProcessStateType>

  getProcess(processId: string): Promise<ProcessStateType>

  addJournalEntry(changes: JournalMutationType): Promise<JournalMutationType>

  getJournalEntries(processId: string): Promise<JournalMutationType[]>

  addNotifier(notifier: ProcessNotifierType): Promise<void>

  getAndDeleteNotifier(options: ProcessNotifierFilterType): Promise<ProcessNotifierType | null>
}
