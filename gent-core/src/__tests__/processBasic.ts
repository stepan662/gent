import b from '../NodeBuilder'
import * as n from '../Node'
import Process from '../Process'
import { SubtaskResult } from '../Subtask'

const [start, exclusive] = b.connect(
  // start event
  n.start({
    id: 'start',
    name: 'Start',
    init: (input) => {
      return new SubtaskResult({
        delay: 5000,
      })
    },
  }),

  // task
  n.exclusive({
    id: 'task',
    name: 'First task',
    decide: () => {
      return new SubtaskResult({
        nextTask: 'end2',
        delay: 5000,
      })
    },
  }),
)

exclusive.connect(
  // end event
  n.end({
    id: 'end1',
    name: 'End',
  }),
)

exclusive.connect(
  // end event
  n.end({
    id: 'end2',
    name: 'End',
  }),
)

export default new Process(
  {
    id: 'process',
    name: 'My first process',
  },
  start,
)
