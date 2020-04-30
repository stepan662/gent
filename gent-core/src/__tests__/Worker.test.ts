import Worker from '../Worker'
import LocalModifier from '../tools/LocalModifier'
import processBasic from './processBasic'
import processResolve from './processResolve'
import processXor from './processXor'
import processError from './processError'
import processErrorHandled from './processErrorHandled'

async function runUntilYouCan(worker: Worker) {
  const notifier = await worker.modifier.getAndDeleteNotifier({
    process_type: worker.process.attributes.id,
    active: true,
  })
  return worker.runWhilePossible(notifier.process_id)
}

async function runSyncStep(worker: Worker) {
  const notifier = await worker.modifier.getAndDeleteNotifier({
    process_type: worker.process.attributes.id,
    active: true,
  })
  const state = await worker.modifier.getProcess(notifier.process_id)
  return worker.runSyncStep(state)
}

describe('Worker', () => {
  it('is able to go through basic process', async () => {
    const modifier = new LocalModifier()
    const worker = new Worker(processBasic, modifier)

    let state = await worker.initProcess({ test: true })

    state = await runSyncStep(worker)

    expect(state.status).toBe('running')
    expect(state.task).toBe('task')

    state = await runSyncStep(worker)

    expect(state.status).toBe('finished')
    expect(state.task).toBe('end')
    expect(state.events.length).toBe(0)
  })

  it('is able to go through process with xor', async () => {
    const modifier = new LocalModifier()
    const worker = new Worker(processXor, modifier)

    await worker.initProcess({ test: true })

    const state = await runUntilYouCan(worker)

    expect(state.status).toBe('finished')
    expect(state.task).toBe('end1')
    expect(state.events.length).toBe(0)
    expect(await worker.modifier.getAndDeleteNotifier({})).toBeFalsy()
  })

  it('is able to go through process with resolve', async () => {
    const modifier = new LocalModifier()
    const worker = new Worker(processResolve, modifier)

    let state = await worker.initProcess({ test: true })

    state = await runSyncStep(worker)

    expect(state.events.length).toBe(1)
    expect(state.status).toBe('waiting')
    expect(state.task).toBe('task')
    expect(state.subtask).toBe(null)

    const response = await worker.runReadSubtask(state.id, state.task, 'readSubtask', [null])
    expect(response).toBe('hello_read_subtask')
    expect(state.status).toBe('waiting')
    // expecting timeout event to stay in events array
    expect(state.events.length).toBe(1)
    expect(state.events[0].subtask).toBe('@timeout')

    state = (await worker.runAsyncSubtask(state.id, state.task, 'resolve', ['Hello resolved task']))
      .state

    expect(state.status).toBe('running')
    expect(state.task).toBe('task')

    // it throws error when trying to resolve twice
    expect(
      worker.runAsyncSubtask(state.id, state.task, 'resolve', ['Hello resolved task']),
    ).rejects.toThrow()

    state = await runUntilYouCan(worker)

    expect(state.status).toBe('finished')
    expect(state.task).toBe('end')
    expect(state.events.length).toBe(0)

    expect(
      worker.runAsyncSubtask(state.id, state.task, 'resolve', ['Hello resolved task']),
    ).rejects.toThrow()
  })

  it('is able to go through process with timeout', async () => {
    const modifier = new LocalModifier()
    const worker = new Worker(processResolve, modifier)

    await worker.initProcess({ test: true })

    let state = await runUntilYouCan(worker)

    expect(state.status).toBe('waiting')
    expect(state.task).toBe('task')

    // expecting timeout event to stay in events array
    expect(state.events.length).toBe(1)
    expect(state.events[0].subtask).toBe('@timeout')

    // force timeout without waiting
    // get notifier
    const notifier = await worker.modifier.getAndDeleteNotifier({
      process_type: worker.process.attributes.id,
    })
    expect(notifier).not.toBe(null)
    // make step manually
    state = await worker.runSyncStep(await worker.modifier.getProcess(notifier.process_id))

    expect(state.status).toBe('running')
    expect(state.task).toBe('task')

    // it throws error when trying to resolve
    expect(
      worker.runAsyncSubtask(state.id, state.task, state.subtask, ['Hello resolved task']),
    ).rejects.toThrow()

    state = await runUntilYouCan(worker)

    // check that return value of timeout was set as output
    expect(state.outputs.task).toBe('hello_timeout_output')

    expect(state.status).toBe('finished')
    expect(state.task).toBe('end_timeout')
    expect(state.events.length).toBe(0)
    expect(await worker.modifier.getAndDeleteNotifier({})).toBeFalsy()
  })

  it('fails on error correctly', async () => {
    const modifier = new LocalModifier()
    const worker = new Worker(processError, modifier)

    await worker.initProcess({ test: true })

    let state = await runUntilYouCan(worker)

    expect(state.status).toBe('error')
    expect(state.error.message).toBe('Error')
    expect(state.task).toBe('task')

    expect(await worker.modifier.getAndDeleteNotifier({})).toBeFalsy()

    // it throws error when trying to resolve
    expect(
      worker.runAsyncSubtask(state.id, state.task, state.subtask, ['Hello resolved task']),
    ).rejects.toThrow()
  })

  it('handles error correctly', async () => {
    const modifier = new LocalModifier()
    const worker = new Worker(processErrorHandled, modifier)

    let state = await worker.initProcess({ test: true })

    state = await runSyncStep(worker)

    state = await runSyncStep(worker)

    expect(state.status).toBe('finished')
    expect(state.task).toBe('end_error')

    expect(await worker.modifier.getAndDeleteNotifier({})).toBeFalsy()

    // it throws error when trying to resolve
    expect(
      worker.runAsyncSubtask(state.id, state.task, state.subtask, ['Hello resolved task']),
    ).rejects.toThrow()
  })
})
