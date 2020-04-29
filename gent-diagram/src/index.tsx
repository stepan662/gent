import React, { useMemo } from 'react'

import dagre from 'dagre'
import Task from './Task'
import End from './End'
import Start from './Start'
import Exclusive from './Exclusive'
import Link from './Link'
import ErrorEvent from './ErrorEvent'
import TimeoutEvent from './TimeoutEvent'

import Context from './Context'

const DEFAULT_THEME = {
  font: 'Lucida Console, Monaco, monospace',
  connectionLine: '#404040',
  connectionLabelColor: 'white',
  connectionLabelBackground: '#404040',
  connectionLabelFontSize: 10,
  taskBorder: 'black',
  taskOuterTextColor: 'black',
  taskOuterBackground: 'rgba(255,255,255,0.9)',
  taskOuterFontSize: 12,
  taskOuterSpace: 22,
  taskInnerTextColor: 'black',
  taskInnerFontSize: 12,
  taskBackground: '#efefef',
  taskRunningBackground: 'lightgreen',
  taskErrorBackground: 'orangered',
  taskActiveBackground: '#404040',
  taskWaitingBackground: 'yellow',
}

const getNext = (schema, element) => {
  const connections = schema.connections.filter((c) => c.from === element._id)
  const nextNodes = schema.nodes.filter((n) => connections.find((c) => c.to === n._id))
  return [connections, nextNodes]
}

const getFillColor = (state, taskId, theme) => {
  const current = state?.current
  if (current && current.task === taskId && current.subtask !== 'timeout') {
    switch (state.current.status) {
      case 'error':
        return theme.taskErrorBackground
      case 'running':
      case 'finished':
        return theme.taskRunningBackground
      case 'waiting':
        return theme.taskWaitingBackground
      default:
        return theme.taskActiveBackground
    }
  }
  return theme.taskBackground
}

const defaultElements = {
  task: Task,
  end: End,
  start: Start,
  exclusive: Exclusive,
}

const VisualProcess = ({
  schema,
  state,
  customTheme,
}: {
  schema: any
  state?: any
  customTheme?: any
}) => {
  const theme = { ...DEFAULT_THEME, ...customTheme }

  const { graph, nodes } = useMemo(() => {
    let start = schema.nodes[0]
    const nodes = [start]
    const graph = new dagre.graphlib.Graph({ multigraph: true })

    graph.setGraph({
      rankdir: 'LR',
      ranker: 'network-simplex',
      marginy: 40,
      marginx: 40,
      ranksep: 60,
    })

    let queueIndex: number = 0

    while (true) {
      const node = nodes[queueIndex++]
      if (!node) {
        break
      }
      const [connections, nextNodes] = getNext(schema, node)

      nextNodes.forEach((nextNode) => {
        if (!nodes.find((n) => nextNode._id === n._id)) {
          nodes.push(nextNode)
        }
      })
      connections.forEach((connection) => {
        graph.setEdge(
          connection.from,
          connection.to,
          {
            id: connection._id,
            labeloffset: 0,
            labelpos: 'c',
            ...Link.getSize(connection, theme),
          },
          connection._id,
        )
      })
    }

    // sort nodes, so tasks are rendered first, because they take most
    // space and are covering other nodes (mostly exclusive)
    nodes.sort((a, b) => {
      return Number(b.type < a.type ? -1 : b.type > a.type)
    })

    nodes.forEach((node) => {
      graph.setNode(node._id, {
        label: node.name || node.id,
        ...defaultElements[node.type].getSize(node, theme),
      })
    })

    dagre.layout(graph)
    return { graph, nodes }
  }, [schema])

  const gOut = graph.graph()

  return (
    <Context.Provider value={{ theme }}>
      <svg
        viewBox={`0 0 ${gOut.width} ${gOut.height}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{
          fontFamily: theme.font,
          maxWidth: gOut.width,
          maxHeight: gOut.height,
          minWidth: gOut.width / 1.5,
          minHeight: gOut.height / 1.5,
          left: 0,
          right: 0,
          fontSize: 12,
        }}
      >
        <g>
          {graph.edges().map((edge) => {
            const edgeProperties = graph.edge(edge)
            const connectionProperties = schema.connections.find((e) => e._id === edgeProperties.id)
            return (
              <Link
                key={edgeProperties.id}
                position={edgeProperties}
                properties={connectionProperties}
              />
            )
          })}
        </g>
        <g>
          {nodes.map((node) => {
            const graphNode = graph.node(node._id)
            const Element = defaultElements[node.type]
            return (
              <Element
                key={node._id}
                data={node}
                place={{
                  y: graphNode.y - graphNode.height / 2,
                  x: graphNode.x - graphNode.width / 2,
                  height: graphNode.height,
                  width: graphNode.width,
                }}
                background={getFillColor(state, node._id, theme)}
              />
            )
          })}
        </g>
        <g>
          {graph.edges().map((edge) => {
            const edgeProperties = graph.edge(edge)
            const connectionProperties = schema.connections.find((e) => e._id === edgeProperties.id)
            if (connectionProperties.link_type === 'error') {
              return (
                <ErrorEvent
                  key={edgeProperties.id}
                  edge={edgeProperties}
                  properties={connectionProperties}
                />
              )
            } else if (connectionProperties.link_type === 'timeout') {
              return (
                <TimeoutEvent
                  key={edgeProperties.id}
                  edge={edgeProperties}
                  properties={connectionProperties}
                  state={state}
                />
              )
            }
            return null
          })}
        </g>
      </svg>
    </Context.Provider>
  )
}

export default VisualProcess
