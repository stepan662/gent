import b from '../NodeBuilder'
import * as n from '../Node'
import Process from '../Process'

const [start, task] = b.connect(
  // start event
  n.start({
    id: 'start',
    name: 'Start',
  }),

  // task
  n.taskSystem({
    id: 'task',
    name: 'First task',
    exec: async () => {
      throw new Error('Error')
    },
  }),
)

const end = task.connect(
  // end event
  n.end({
    id: 'end',
    name: 'End',
  }),
)

task.connect(n.linkError(), n.end({ id: 'end_error' }))

export default new Process(
  {
    id: 'process',
    name: 'My first process',
    init: (input) => {
      return input
    },
  },
  start,
)
