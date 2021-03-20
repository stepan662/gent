import React from 'react'
import { SchemaNode } from '../types/ProcessSchema'
import { ProcessStateType } from '../types/ProcessState'
import { SubProcess } from './ElementInterface'
import ElementInterface from './ElementInterface'
import Process from './Process'
import { Task } from './Task'

const getRelevantSubprocesses = (state: ProcessStateType, node: SchemaNode, subs: SubProcess[]) => {
  const subIds = state.subProcesses.filter((v) => v.task === node.id).map((v) => v.id)
  return subs?.filter(({ state }) => subIds.includes(state.id)) || []
}

export const Subprocess: ElementInterface = (props) => {
  const { node, place, state, theme, subs, level } = props
  const relevantSubs = getRelevantSubprocesses(state, node, subs)

  const { x, y } = place

  if (relevantSubs.length === 0) {
    return <Task {...props} />
  }

  let yShift = 0

  return (
    <React.Fragment>
      <rect {...place} stroke={theme.taskBorder} fill={theme.subtaskBackground}></rect>
      {relevantSubs.map((sub) => {
        const { schema, state } = sub
        const dimensions = Process.getSize({
          schema,
          state,
          subs,
          theme,
          node: null,
          level: level + 1,
        })
        const yCor = y + yShift
        yShift += dimensions.height
        return (
          <Process
            schema={sub.schema}
            state={sub.state}
            subs={subs}
            theme={theme}
            node={null}
            place={{
              x,
              y: yCor,
            }}
            level={level + 1}
          />
        )
      })}
    </React.Fragment>
  )
}

Subprocess.getSize = (props) => {
  const { state, node, subs, level } = props
  const relevantSubs = getRelevantSubprocesses(state, node, subs)
  const relevantSubDimensions = relevantSubs.map(({ schema, state }) =>
    Process.getSize({ schema, state, subs, theme: props.theme, node: null, level: level + 1 }),
  )
  if (relevantSubDimensions.length === 0) {
    return Task.getSize(props)
  } else {
    const result = {
      width: Math.max(...relevantSubDimensions.map((d) => d.width)),
      height: relevantSubDimensions.map((d) => d.height).reduce((a, b) => a + b, 0),
    }

    return result
  }
}
