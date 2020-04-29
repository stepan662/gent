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
  tags: ProcessTagsType
  outputs: ProcessTasksType
  current: ProcessCurrentType
  events: ProcessEventType[]
}

export type ProcessTagsType = {
  [key: string]: string
}

export type ProcessTasksType = {
  [id: string]: any
}

export type ProcessCurrentType = {
  task: string
  subtask: string
  status: string
  task_state: any
  error?: ProcessErrorType
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

export type LinkTypeType = 'exclusive' | 'error' | 'timeout' | undefined

export type LinkType = ElementType & {
  type: 'link'
  link_type?: LinkTypeType
}

export type ExclusiveLinkType = LinkType & {
  link_type: 'exclusive'
}

export type ErrorCheckerInputType = string | string[] | ((e: ProcessErrorType) => boolean)

export type ErrorLinkType = LinkType & {
  link_type: 'error'
  error: ErrorCheckerInputType
}

export type TimeoutLinkType = LinkType & {
  link_type: 'timeout'
  timeout: number
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
  run: SubtaskType
}

export type TaskType = ElementType & {
  _first?: string
  type: 'task'
  task_type: string
  [subtaskId: string]: SubtaskType | string
}

export type NodeType = StartType | EndType | ExclusiveType | TaskType

export type SubtaskType = {
  func: (input?: any) => Promise<SubtaskResultType> | SubtaskResultType
  read_only: boolean
  external: boolean
  method?: RestMethods
}

export type RestMethods = 'get' | 'post' | 'put' | 'patch' | 'delete'

export type SubtaskResultType = {
  output?: any
  next_task?: string
  next_subtask?: string
}

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

  updateProcess(process: ProcessStateType, changes?: JournalMutationType): Promise<ProcessStateType>

  getProcess(processId: string): Promise<ProcessStateType>

  addJournalEntry(changes: JournalMutationType): Promise<JournalMutationType>

  getJournalEntries(processId: string): Promise<JournalMutationType[]>

  addNotifier(notifier: ProcessNotifierType): Promise<void>

  getAndDeleteNotifier(options: ProcessNotifierFilterType): Promise<ProcessNotifierType | null>
}
