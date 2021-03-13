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
    run: ({ currentInput, currentSubtask, taskState }) => {
      if (currentInput?.started) {
        return new SubtaskResult({
          taskState: {
            _subProcesses: currentInput.started,
          },
          nextSubtask: currentSubtask,
          pause: true,
        })
      } else if (currentInput?.finished) {
        const subProcesses = taskState._subProcesses.map((sp) =>
          sp.id === currentInput.finished.id ? currentInput.finished : sp,
        )

        if (subProcesses.every((sp) => sp.status === 'finished')) {
          // finish
          return null
        } else {
          return new SubtaskResult({
            taskState: {
              _subProcesses: subProcesses,
            },
            nextSubtask: currentSubtask,
            pause: true,
          })
        }
      } else {
        return new SubtaskResult({
          subProcesses: [
            {
              id: null,
              status: 'init',
              type: 'process1',
              version: 'test',
              input: null,
              reply: true,
            },
            {
              id: null,
              status: 'init',
              type: 'process1',
              version: 'test',
              input: null,
              reply: true,
            },
          ],
          nextSubtask: currentSubtask,
          pause: true,
        })
      }
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
