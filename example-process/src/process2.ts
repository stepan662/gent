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
    run: () => {},
  }),
)

task.connect(
  // end event
  n.end({
    id: 'end',
    name: 'End',
    finish: () => {
      return new SubtaskResult({
        subProcesses: [
          {
            id: null,
            status: 'init',
            type: 'process1',
            version: 'test',
            input: null,
            reply: false,
          },
        ],
      })
    },
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
