import b from 'gent-core/lib/NodeBuilder'
import * as n from 'gent-core/lib/Node'
import Process from 'gent-core/lib/Process'

const [start, task] = b.connect(
  // start event
  n.start({
    id: 'start',
    name: 'Start',
    init: () => {},
  }),

  // task
  n.subProcess({
    id: 'subprocess',
    name: 'Subprocess',
    subprocesses: [
      {
        type: 'process2',
        version: 'test',
        input: null,
      },
      {
        type: 'process2',
        version: 'test',
        input: null,
      },
    ],
    onStart: () => {
      console.log('onStart')
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
    type: 'process3',
    version: 'test',
    name: 'Process 3',
  },
  start,
)
