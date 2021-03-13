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
    name: '3x repeated task',
    run: async ({ state }) => {
      await new Promise((resolve) => setTimeout(resolve, 5000))
      const round = state?.round || 0
      return new SubtaskResult({
        state: {
          round: round + 1,
        },
      })
    },
  }),
)

const exclusive = task.connect(
  n.exclusive({
    id: 'exclusive',
    name: 'How many times has task ran?',
    decide: ({ state }) => {
      return new SubtaskResult({
        nextTask: state.round >= 3 ? 'end' : 'waitTask',
        delay: 1000,
      })
    },
  }),
)

const waitTask = exclusive.connect(
  n.link({ name: '< 3' }),
  n.task({
    id: 'waitTask',
    name: 'Wait 3s',
    run: () => {
      return new SubtaskResult({
        delay: Math.floor(Math.random() * 3000),
      })
    },
  }),
)

waitTask.connect(task)

exclusive.connect(
  n.link({
    name: '>= 3',
  }),
  // end event
  n.end({
    id: 'end',
    name: 'End',
  }),
)

export default new Process(
  {
    type: 'process1',
    version: 'test',
    name: 'Process 1',
  },
  start,
)
