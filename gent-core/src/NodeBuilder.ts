import { NodeType, LinkType, ElementType } from './Types'
import * as n from './Node'

export type WrappedConnection = {
  node1: NodeType
  node2: NodeType
  connection: LinkType
}

type ConnectItemType = NodeType | NodeBuilder | NodeBuilder[]

class NodeBuilder {
  private next: NodeBuilder[] = []
  private node: ElementType

  private constructor(node: NodeType) {
    this.node = node
  }

  private static wrap(node: any): NodeBuilder {
    if (node instanceof NodeBuilder) {
      return node
    } else {
      return new NodeBuilder(node)
    }
  }

  getNext() {
    return this.next
  }

  getNode() {
    return this.node
  }

  private static unpackNode = (node) => {
    if (Array.isArray(node)) {
      return node
    }
    const wrappedNode = NodeBuilder.wrap(node)
    return [wrappedNode, wrappedNode]
  }

  public static connect(first: ConnectItemType, second: ConnectItemType): NodeBuilder[]
  public static connect(
    first: ConnectItemType,
    link: LinkType,
    second: ConnectItemType,
  ): NodeBuilder[]
  public static connect(arg1, arg2, arg3?) {
    const [start, first] = NodeBuilder.unpackNode(arg1)
    const link = NodeBuilder.wrap(arg3 ? arg2 : n.link())
    const [second, end] = NodeBuilder.unpackNode(arg3 ? arg3 : arg2)

    NodeBuilder.connectOne(first, link)
    NodeBuilder.connectOne(link, second)
    return [start, end]
  }

  public connect(second: ConnectItemType): NodeBuilder
  public connect(link: LinkType, second: ConnectItemType): NodeBuilder
  public connect(arg1, arg2?) {
    if (arg2) {
      return NodeBuilder.connect(this, arg1 as LinkType, arg2)[1]
    } else {
      return NodeBuilder.connect(this, arg1)[1]
    }
  }

  public static connectOne(el1: NodeBuilder, el2: NodeBuilder) {
    el1.next.push(el2)
  }

  public toNodeBase() {
    return this.node
  }
}

export default NodeBuilder
