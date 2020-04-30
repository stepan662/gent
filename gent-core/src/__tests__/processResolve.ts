import b from '../NodeBuilder'
import * as n from '../Node'
import Process from '../Process'
import { gentUpdateState } from '../Hooks'

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
    readSubtask: n.subtaskRead(() => {
      return 'hello_read_subtask'
    }),
  }),
)

const end = task.connect(
  // end event
  n.end({
    id: 'end',
    name: 'End',
  }),
)

task.connect(
  n.linkTimeout({ timeout: 10, exec: () => 'hello_timeout_output' }),
  n.end({ id: 'end_timeout' }),
)

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
