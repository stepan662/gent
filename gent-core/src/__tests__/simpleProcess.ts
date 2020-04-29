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
      console.log('Hello my first task')
    },
  }),
)

task.connect(
  // end event
  n.end({
    id: 'end',
    name: 'End',
  }),
)

const simpleProcess = new Process(
  {
    id: 'process',
    name: 'My first process',
    init: (input) => input,
  },
  start,
)

export default simpleProcess
