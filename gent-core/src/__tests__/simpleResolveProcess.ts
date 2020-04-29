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
  n.taskUser({
    id: 'task',
    name: 'First task',
    resolve: async (data) => {
      console.log(data)
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

task.connect(n.linkTimeout({ timeout: 10 }), end)

const simpleProcess = new Process(
  {
    id: 'process',
    name: 'My first process',
    init: (input) => {
      return input
    },
  },
  start,
)

export default simpleProcess
