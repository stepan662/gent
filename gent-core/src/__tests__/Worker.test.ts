import Worker from '../Worker'
import simpleProcess from './simpleProcess'
import simpleResolveProcess from './simpleResolveProcess'
import LocalModifier from '../tools/LocalModifier'
import { ProcessStateType } from '../Types'

async function makeStep(worker: Worker) {
  const notifier = await worker.modifier.getAndDeleteNotifier({
    process_type: worker.process.attributes.id,
    active: true,
  })
  if (!notifier) {
    return false
  }
  const state = await worker.modifier.getProcess(notifier.process_id)
  return await worker.step(state)
}

async function runUntilYouCan(worker: Worker) {
  let state: ProcessStateType
  while (true) {
    const result = await makeStep(worker)
    if (result) {
      state = result
    } else {
      break
    }
  }
  return state
}

describe('Worker', () => {
  it('is able to go through simple process', async () => {
    const modifier = new LocalModifier()
    const worker = new Worker(simpleProcess, modifier)

    await worker.initProcess({ test: true })

    const state = await runUntilYouCan(worker)

    expect(state.current.status).toBe('finished')
    expect(state.current.task).toBe('end')
    expect(state.events.length).toBe(0)
  })

  it('is able to go through simple process with resolve', async () => {
    const modifier = new LocalModifier()
    const worker = new Worker(simpleResolveProcess, modifier)

    await worker.initProcess({ test: true })

    let state = await runUntilYouCan(worker)

    expect(state.current.status).toBe('waiting')
    expect(state.current.task).toBe('task')

    // expecting timeout event to stay in events array
    expect(state.events.length).toBe(1)

    state = (
      await worker.handleExternalTask(state.id, state.current.task, state.current.subtask, [
        'Hello resolved task',
      ])
    ).state

    expect(state.current.status).toBe('running')
    expect(state.current.task).toBe('task')

    // it throws error when trying to resolve twice
    expect(
      worker.handleExternalTask(state.id, state.current.task, state.current.subtask, [
        'Hello resolved task',
      ]),
    ).rejects.toThrow()

    state = await runUntilYouCan(worker)

    expect(state.current.status).toBe('finished')
    expect(state.current.task).toBe('end')
    expect(state.events.length).toBe(0)

    expect(
      worker.handleExternalTask(state.id, state.current.task, 'test', ['Hello resolved task']),
    ).rejects.toThrow()
  })
})
