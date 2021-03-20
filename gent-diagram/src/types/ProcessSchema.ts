export type Schema = {
  attributes: SchemaAttributes
  connections: SchemaConnection[]
  nodes: SchemaNode[]
}

export type SchemaAttributes = {
  type: string
  version: string
  name: string
  description: string
}

export type SchemaConnection = {
  id: string
  name: string
  description: string
  from: string
  to: string
}

export type SchemaNode = {
  id: string
  name: string
  type: string
}
