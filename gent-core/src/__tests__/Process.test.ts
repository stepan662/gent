import b from '../NodeBuilder'
import * as n from '../Node'
import Process from '../Process'

describe('NodeBuilder', () => {
  it('creates simple process', () => {
    const [start, task1] = b.connect(
      n.start(),
      n.link(),
      n.taskSystem({
        id: 'system_task',
        name: 'System task',
        exec: () => null,
      }),
    )

    const task2 = task1.connect(
      n.link(),
      n.taskUser({ id: 'user_task', name: 'User task', resolve: () => null }),
    )

    const end = task2.connect(n.link(), n.end())

    // alternative route
    b.connect(start, n.link({ name: 'Shortcut' }), end)

    const process = new Process(
      { id: 'test_process', name: 'Test process', init: () => null },
      start,
    )
    const schema = process.getSchema()
  })
})
