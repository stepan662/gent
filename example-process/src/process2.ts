import b from 'gent-core/lib/NodeBuilder'
import * as n from 'gent-core/lib/Node'
import Process from 'gent-core/lib/Process'
import { SubtaskResult } from 'gent-core/lib/Subtask'

const [start, task] = b.connect(
  // start event
  n.start({
    id: 'start',
    name: 'Start',
    init: () => {},
  }),

  // task
  n.task({
    id: 'task',
    name: 'Simple task',
    run: ({ state }) => {
      const round = state?.round || 0
      return new SubtaskResult({
        state: {
          round: round + 1,
        },
        delay: 5000,
      })
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
    type: 'process2',
    version: 'test',
    name: 'Process 2',
  },
  start,
)
