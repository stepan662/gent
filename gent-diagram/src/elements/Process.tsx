import React from 'react'
import { ProcessStateType } from '../types/ProcessState'
import { Schema } from '../types/ProcessSchema'
import theme from '../Theme'
import { getGraph } from '../dagre'
import { Task, End, Start, Exclusive, Link, Subprocess } from '.'
import ElementInterface from './ElementInterface'

const defaultElements = {
  task: Task,
  end: End,
  start: Start,
  exclusive: Exclusive,
  subprocess: Subprocess,
}

const getFillColor = (state: ProcessStateType, taskId: string, th: typeof theme) => {
  if (state?.currentTask === taskId) {
    switch (state.status) {
      case 'error':
        return th.taskErrorBackground
      case 'running':
      case 'finished':
        return state.nextDeployTime ? th.taskWaitingBackground : th.taskRunningBackground
      case 'waiting':
        return th.taskWaitingBackground
      default:
        return th.taskActiveBackground
    }
  }
  return th.taskBackground
}

const sizeMapper = ({ schema, state, subs, level }) => (taskType: string, taskId: string) => {
  if (taskType === 'link') {
    return Link.getSize(
      schema.connections.find((c) => c.id === taskId),
      theme,
    )
  } else {
    const node = schema.nodes.find((n) => n.id === taskId)
    return (defaultElements[taskType] as ElementInterface).getSize({
      node,
      theme,
      subs,
      state,
      schema,
      level,
    })
  }
}

const scale = (level: number) => {
  const scaleSpeed = 0.3
  return 1 / (level * scaleSpeed + 1)
}

const Process: ElementInterface = ({ schema, state, subs, place: { x, y }, level }) => {
  const { connections, nodes } = getGraph({
    schema,
    theme,
    sizeMapper: sizeMapper({ schema, state, subs, level }),
  })

  return (
    <g transform={`translate(${x}, ${y}), scale(${scale(level)})`}>
      {connections.map((con) => {
        return <Link key={con.id} position={con.dimensions} theme={theme} properties={con} />
      })}
      {nodes.map((node) => {
        const Element: ElementInterface = defaultElements[node.type] || defaultElements['task']
        return (
          <Element
            key={node.id}
            node={node}
            theme={theme}
            clickable={false}
            schema={schema}
            state={state}
            subs={subs}
            place={{
              y: node.dimensions.y - node.dimensions.height / 2,
              x: node.dimensions.x - node.dimensions.width / 2,
              height: node.dimensions.height,
              width: node.dimensions.width,
            }}
            background={getFillColor(state, node.id, theme)}
            level={level}
          />
        )
      })}
    </g>
  )
}

Process.getSize = ({ schema, state, subs, level }) => {
  const { dimensions } = getGraph({
    schema,
    theme,
    sizeMapper: sizeMapper({ schema, state, subs, level }),
  })
  console.log(level)
  return {
    height: dimensions.height * scale(level),
    width: dimensions.width * scale(level),
  }
}

export default Process
