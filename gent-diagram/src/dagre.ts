import dagre, { graphlib } from 'dagre'
import { Schema, SchemaConnection, SchemaNode } from './types/ProcessSchema'
import theme from './Theme'
import { ProcessStateType } from './types/ProcessState'

const getNext = (schema: Schema, element) => {
  const connections = schema.connections.filter((c) => c.from === element.id)
  const nextNodes = schema.nodes.filter((n) => connections.find((c) => c.to === n.id))
  return [connections, nextNodes]
}

export type ComputedGraphProps = {
  schema: Schema
  theme: typeof theme
  sizeMapper: (taskType: string, taskId: string) => { width: number; height: number }
}

export type ComputedGraphResult = {
  connections: (SchemaConnection & {
    dimensions: dagre.GraphEdge
  })[]
  nodes: (SchemaNode & {
    dimensions: dagre.Node
  })[]
  dimensions: dagre.GraphLabel
}

export const getGraph = ({
  schema,
  theme,
  sizeMapper,
}: ComputedGraphProps): ComputedGraphResult => {
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
      if (!nodes.find((n) => nextNode.id === n.id)) {
        nodes.push(nextNode)
      }
    })
    connections.forEach((connection) => {
      graph.setEdge(
        connection.from,
        connection.to,
        {
          id: connection.id,
          labeloffset: 0,
          labelpos: 'c',
          ...sizeMapper('link', connection.id),
        },
        connection.id,
      )
    })
  }

  // sort nodes, so tasks are rendered first, because they take most
  // space and are covering other nodes (mostly exclusive)
  nodes.sort((a, b) => {
    return Number(b.type < a.type ? -1 : b.type > a.type)
  })

  nodes.forEach((node) => {
    graph.setNode(node.id, {
      label: node.name || node.id,
      ...sizeMapper(node.type, node.id),
    })
  })

  dagre.layout(graph)

  const computedNodes = nodes.map((node) => {
    const graphNode = graph.node(node.id)

    return {
      ...node,
      dimensions: graphNode,
    }
  })

  const computedConnections = graph.edges().map((val) => {
    const edge = graph.edge(val)
    const connection = schema.connections.find((e) => e.id === edge.id)
    return {
      ...connection,
      dimensions: edge,
    }
  })

  return {
    connections: computedConnections,
    nodes: computedNodes,
    dimensions: graph.graph(),
  }
}
