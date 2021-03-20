import React from 'react'
import { SchemaNode } from '../types/ProcessSchema'
import { ProcessStateType } from '../types/ProcessState'
import { SubProcess } from './ElementInterface'
import ElementInterface from './ElementInterface'
import Process from './Process'
import { Task } from './Task'

const getRelevantSubs = (state: ProcessStateType, node: SchemaNode) => {
  return state.subProcesses.filter((v) => v.task === node.id)
}

const getRelevantSubsFullState = (
  state: ProcessStateType,
  node: SchemaNode,
  subs: SubProcess[],
) => {
  const subIds = getRelevantSubs(state, node).map((s) => s.id)
  return subs?.filter(({ state }) => subIds.includes(state.id)) || []
}

export const Subprocess: ElementInterface = (props) => {
  const { node, place, state, theme, subs, level, getProcessSize, options, background } = props
  const relevantSubs = getRelevantSubs(state, node)
  const relevantSubsStates = getRelevantSubsFullState(state, node, subs)

  const { x, y, width, height } = place

  const onClickHandler = () => {
    if (options.onRequestSubprocess && level < options.allowedLevel) {
      options.onRequestSubprocess(relevantSubs.map((s) => s.id))
    }
  }

  if (relevantSubsStates.length === 0) {
    return (
      <React.Fragment>
        <rect
          {...place}
          stroke={theme.taskBorder}
          fill={background}
          onClick={onClickHandler}
        ></rect>
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          alignmentBaseline="central"
          fill={theme.taskInnerTextColor}
          fontFamily={`${theme.taskInnerFontSize}px`}
          onClick={onClickHandler}
        >
          {node.name}
        </text>
      </React.Fragment>
    )
  }

  let yShift = 0

  return (
    <React.Fragment>
      <rect {...place} stroke={theme.taskBorder} fill={theme.subtaskBackground}></rect>
      {relevantSubsStates.map((sub) => {
        const { schema, state } = sub
        const dimensions = getProcessSize({
          schema,
          state,
          subs,
          theme,
          node: null,
          level: level + 1,
          getProcessSize,
          options,
        })
        const yCor = y + yShift
        yShift += dimensions.height
        return (
          <Process
            key={state.id}
            schema={schema}
            state={state}
            subs={subs}
            theme={theme}
            getProcessSize={getProcessSize}
            place={{
              x,
              y: yCor,
            }}
            level={level + 1}
            options={options}
          />
        )
      })}
    </React.Fragment>
  )
}

Subprocess.getSize = (props) => {
  const { state, node, subs, level } = props
  const relevantSubs = getRelevantSubsFullState(state, node, subs)
  const relevantSubDimensions = relevantSubs.map(({ schema, state }) =>
    props.getProcessSize({ ...props, schema, state, level: level + 1 }),
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
