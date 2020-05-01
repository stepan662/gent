import Automat from '../Automat'
import LocalModifier from '../tools/LocalModifier'
import processBasic from './processBasic'
import processResolve from './processResolve'
import processXor from './processXor'
import processError from './processError'
import processErrorHandled from './processErrorHandled'

async function runUntilYouCan(automat: Automat) {
  const notifier = await automat.modifier.getAndDeleteNotifier({
    process_type: automat.process.attributes.id,
    active: true,
  })
  return automat.runWhilePossible(notifier.process_id)
}

async function runSyncStep(automat: Automat) {
  const notifier = await automat.modifier.getAndDeleteNotifier({
    process_type: automat.process.attributes.id,
    active: true,
  })
  const state = await automat.modifier.getProcess(notifier.process_id)
  return automat.runSyncStep(state)
}

describe('Automat', () => {
  it('is able to go through basic process', async () => {
    const modifier = new LocalModifier()
    const automat = new Automat(processBasic, modifier)

    let state = await automat.initProcess({ test: true })

    state = await runSyncStep(automat)

    expect(state.events.length).toBe(1)
    expect(state.status).toBe('running')
    expect(state.task).toBe('task')
    expect(state.outputs.task).toBe('hello_task_output')
    expect(state.tags.task).toBe('passed')

    state = await runSyncStep(automat)

    expect(state.status).toBe('finished')
    expect(state.task).toBe('end')
    expect(state.events.length).toBe(0)
  })

  it('is able to go through process with xor', async () => {
    const modifier = new LocalModifier()
    const automat = new Automat(processXor, modifier)

    await automat.initProcess({ test: true })

    const state = await runUntilYouCan(automat)

    expect(state.status).toBe('finished')
    expect(state.task).toBe('end1')
    expect(state.events.length).toBe(0)
    expect(await automat.modifier.getAndDeleteNotifier({})).toBeFalsy()
  })

  it('is able to go through process with resolve', async () => {
    const modifier = new LocalModifier()
    const automat = new Automat(processResolve, modifier)

    let state = await automat.initProcess({ test: true })

    state = await runSyncStep(automat)

    expect(state.events.length).toBe(1)
    expect(state.status).toBe('waiting')
    expect(state.task).toBe('task')
    expect(state.subtask).toBe(null)

    const response = await automat.runReadSubtask(state.id, state.task, 'readSubtask', [null])
    expect(response).toBe('hello_read_subtask')
    expect(state.status).toBe('waiting')
    // expecting timeout event to stay in events array
    expect(state.events.length).toBe(1)
    expect(state.events[0].subtask).toBe('@timeout')

    state = (
      await automat.runAsyncSubtask(state.id, state.task, 'resolve', ['Hello resolved task'])
    ).state

    expect(state.status).toBe('running')
    expect(state.task).toBe('task')

    // it throws error when trying to resolve twice
    expect(
      automat.runAsyncSubtask(state.id, state.task, 'resolve', ['Hello resolved task']),
    ).rejects.toThrow()

    state = await runUntilYouCan(automat)

    expect(state.status).toBe('finished')
    expect(state.task).toBe('end')
    expect(state.events.length).toBe(0)

    expect(
      automat.runAsyncSubtask(state.id, state.task, 'resolve', ['Hello resolved task']),
    ).rejects.toThrow()
  })

  it('is able to go through process with timeout', async () => {
    const modifier = new LocalModifier()
    const automat = new Automat(processResolve, modifier)

    await automat.initProcess({ test: true })

    let state = await runUntilYouCan(automat)

    expect(state.status).toBe('waiting')
    expect(state.task).toBe('task')
    expect(state.subtask).toBe(null)

    // expecting timeout event to stay in events array
    expect(state.events.length).toBe(1)
    expect(state.events[0].subtask).toBe('@timeout')

    // force timeout without waiting
    // get notifier
    const notifier = await automat.modifier.getAndDeleteNotifier({
      process_type: automat.process.attributes.id,
    })
    expect(notifier).not.toBe(null)
    // make step manually
    state = await automat.runSyncStep(await automat.modifier.getProcess(notifier.process_id))

    expect(state.status).toBe('running')
    expect(state.task).toBe('task')

    // it throws error when trying to resolve
    expect(
      automat.runAsyncSubtask(state.id, state.task, state.subtask, ['Hello resolved task']),
    ).rejects.toThrow()

    state = await runUntilYouCan(automat)

    // check that return value of timeout was set as output
    expect(state.outputs.task).toBe('hello_timeout_output')

    expect(state.status).toBe('finished')
    expect(state.task).toBe('end_timeout')
    expect(state.events.length).toBe(0)
    expect(await automat.modifier.getAndDeleteNotifier({})).toBeFalsy()
  })

  it('fails on error correctly', async () => {
    const modifier = new LocalModifier()
    const automat = new Automat(processError, modifier)

    await automat.initProcess({ test: true })

    let state = await runUntilYouCan(automat)

    expect(state.status).toBe('error')
    expect(state.error.message).toBe('Error')
    expect(state.task).toBe('task')

    expect(await automat.modifier.getAndDeleteNotifier({})).toBeFalsy()

    // it throws error when trying to resolve
    expect(
      automat.runAsyncSubtask(state.id, state.task, state.subtask, ['Hello resolved task']),
    ).rejects.toThrow()
  })

  it('handles error correctly', async () => {
    const modifier = new LocalModifier()
    const automat = new Automat(processErrorHandled, modifier)

    let state = await automat.initProcess({ test: true })

    state = await runSyncStep(automat)

    state = await runSyncStep(automat)

    expect(state.status).toBe('finished')
    expect(state.task).toBe('end_error')

    expect(await automat.modifier.getAndDeleteNotifier({})).toBeFalsy()

    // it throws error when trying to resolve
    expect(
      automat.runAsyncSubtask(state.id, state.task, state.subtask, ['Hello resolved task']),
    ).rejects.toThrow()
  })
})
