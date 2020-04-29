import { ProcessContextType, MutationType, ProcessEventType } from './Types'
import { mutateState } from './Journal'
import { Namespace } from 'continuation-local-storage'

export function updateContextState(context: ProcessContextType, changes: MutationType) {
  const [newState, mutation] = mutateState(context.state, changes)
  context.state = newState
  context.journal.push(mutation)
}

type EventInput = {
  task?: string
  subtask?: string
  delay?: number
  data?: any
}

export function addEvent(context: ProcessContextType, eventInput: EventInput) {
  const newEvent = createEvent(eventInput)
  const events = [...context.state.events, newEvent].sort(
    (a, b) => (a.deploy_time || a.created) - (b.deploy_time || b.created),
  )
  updateContextState(context, {
    events,
  })
}

export function removeCurrentEvent(context: ProcessContextType, event: ProcessEventType) {
  updateContextState(context, {
    events: context.state.events.filter((e) => e !== event),
  })
}

function createEvent({ task, subtask, data, delay }: EventInput): ProcessEventType {
  return {
    task: task || null,
    subtask: subtask || null,
    data: data || null,
    deploy_time: delay ? Date.now() + delay : null,
    created: Date.now(),
  }
}

export async function runWithContext(
  context: ProcessContextType,
  workerNamespace: Namespace,
  func: (...attrs: any[]) => any,
  attrs = [],
) {
  return workerNamespace.runAndReturn(async () => {
    workerNamespace.set('context', context)
    const result = await func(...attrs)
    const newContext = workerNamespace.get('context')
    workerNamespace.set('context', null)
    context.state = newContext.state
    context.journal = newContext.journal
    return result
  })
}
