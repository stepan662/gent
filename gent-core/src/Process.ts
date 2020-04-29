import NodeBuilder from './NodeBuilder'
import { NodeType, ProcessAttributes, Connection, LinkType, LinkTypeType } from './Types'

class Process {
  attributes: ProcessAttributes
  nodes: NodeType[]
  connections: Connection[]

  constructor(attributes: ProcessAttributes, start: NodeBuilder) {
    const connections: Connection[] = []
    const idCounters: {
      [type: string]: number
    } = {}

    this.addIdIfMissing(start, idCounters)
    this.checkNode(start)

    const queue: NodeBuilder[] = [start]
    let queueIndex: number = 0

    while (true) {
      const node = queue[queueIndex++]
      if (!node) {
        break
      }

      for (const linkNode of node.getNext()) {
        this.addIdIfMissing(linkNode, idCounters)
        this.checkLink(linkNode)

        const nextNode = linkNode.getNext()[0]
        this.checkNode(nextNode)

        this.addIdIfMissing(nextNode, idCounters)
        connections.push({
          from: node.getNode()._id,
          to: nextNode.getNode()._id,
          ...(linkNode.getNode() as LinkType),
        })

        if (!queue.includes(nextNode)) {
          queue.push(nextNode)
        }
      }
    }

    this.attributes = attributes
    this.connections = connections
    this.nodes = []
    for (const wrapped of queue) {
      const node = wrapped.getNode() as NodeType
      this.checkId(node)
      this.nodes.push(node)
    }
  }

  getNextConnections(node: NodeType, linkType?: LinkTypeType): Connection[] {
    return this.connections.filter((c) => {
      return c.from === node._id && c.link_type === linkType
    })
  }

  nextNode(node: NodeType) {
    const connection = this.getNextConnections(node)[0]
    if (!connection?.to) {
      throw Error(`Node ${node._id} has no next node`)
    }
    return this.getNode(connection.to)
  }

  public getNode(nodeId) {
    return this.nodes.find((n) => n._id === nodeId)
  }

  public getSchema() {
    return {
      attributes: {
        id: this.attributes.id,
        name: this.attributes.name || null,
        description: this.attributes.description || null,
      },
      connections: this.connections.map((c) => ({
        _id: c._id,
        id: c.id || null,
        name: c.name || null,
        description: c.description || null,
        from: c.from,
        to: c.to,
        link_type: c.link_type,
      })),
      nodes: this.nodes.map((n) => ({
        _id: n._id,
        id: n.id,
        name: n.name,
        description: n.description,
        type: n.type,
        // @ts-ignore
        task_type: n.task_type,
      })),
    }
  }

  /*
   * Add internal '_id', use user 'id' if present
   */
  private addIdIfMissing(element: NodeBuilder, idCounters) {
    const node = element.getNode()

    if (node._id) {
      return
    }

    if (node.id) {
      node._id = node.id
    } else {
      const elType = node.type
      const num = idCounters[elType] || 0

      node._id = `_${elType}_${num}`
      idCounters[elType] = num + 1
    }
  }

  private checkLink(node: NodeBuilder) {
    const elType = node.getNode().type
    if (elType !== 'link') {
      throw new Error(`Expecting 'link' got '${elType}'`)
    }
  }

  private checkNode(node: NodeBuilder) {
    const elType = node.getNode().type
    if (elType === 'link') {
      throw new Error(`Expecting node got 'link'`)
    }
  }

  private checkId(node: NodeType) {
    if (node.id && this.getNode(node.id)) {
      throw new Error(`Two nodes with same id '${node.id}'`)
    }
  }
}

export default Process
