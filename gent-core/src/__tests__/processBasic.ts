import b from '../NodeBuilder'
import * as n from '../Node'
import Process from '../Process'
import { gentUpdateTags } from '../Hooks'

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
      gentUpdateTags({ task: 'passed' })
      return 'hello_task_output'
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

export default new Process(
  {
    id: 'process',
    name: 'My first process',
    init: (input) => input,
  },
  start,
)
