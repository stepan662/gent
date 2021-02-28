import b from '../NodeBuilder'
import * as n from '../Node'
import Process from '../Process'
import { SubtaskResult } from '../Subtask'
import { staged } from '../StagedSubtask'

const [start, task] = b.connect(
  // start event
  n.start({
    id: 'start',
    name: 'Start',
    init: () => {
      return new SubtaskResult({
        delay: 5000,
      })
    },
  }),

  // task
  n.task({
    id: 'task',
    name: '3x repeated task',
    run: staged(async ({ stage, loop }) => {
      const first = await stage(() => {
        return new SubtaskResult({
          taskState: {
            message: `I'm in stage 1`,
          },
          returnData: '1',
          delay: 5000,
        })
      })

      const second = await stage(() => {
        return new SubtaskResult({
          taskState: {
            message: `I'm in stage 2`,
          },
          returnData: 2,
          delay: 5000,
        })
      })

      const loopResult = await loop(({ index }) => {
        return new SubtaskResult({
          taskState: {
            message: `I've looped ${index + 1} time(s)`,
          },
          delay: 5000,
          returnData: index < 3 ? null : 'heelo',
        })
      })

      const third = await stage(() => {
        return new SubtaskResult({
          taskState: {
            message: `I'm in stage 2`,
          },
          returnData: 3,
          delay: 5000,
        })
      })

      console.log(`${first} ${second} ${loopResult} ${third}`)
      return new SubtaskResult({
        delay: 10000,
      })
    }),
  }),
)

const exclusive = task.connect(
  n.exclusive({
    id: 'exclusive',
    name: 'Exclusive',
    decide: () => {
      return new SubtaskResult({
        nextTask: 'end2',
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
