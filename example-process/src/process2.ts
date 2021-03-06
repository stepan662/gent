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
    finish: ({ id, currentSubtask, currentTask, type, version, currentInput }) => {
      if (!currentInput._results) {
        return new SubtaskResult({
          externalActions: [
            {
              type: 'processStart',
              data: {
                type: 'process1',
                version: 'test',
                caller: {
                  id,
                  type,
                  version,
                  task: currentTask,
                  subtask: currentSubtask,
                  subprocess: false,
                },
                input: null,
              },
            },
          ],
          nextSubtask: currentSubtask,
          taskState: { finished: true },
        })
      }
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
