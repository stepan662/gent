import b from '../NodeBuilder'
import * as n from '../Node'
import Process from '../Process'

const [start, exclusive] = b.connect(
  // start event
  n.start({
    id: 'start',
    name: 'Start',
  }),

  n.exclusive({
    id: 'exclusive',
    decide: () => 'end1',
  }),
)

exclusive.connect(
  // end event
  n.end({
    id: 'end1',
  }),
)

exclusive.connect(
  // end event
  n.end({
    id: 'end2',
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
