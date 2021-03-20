import React from 'react'
import { ProcessStateType } from '../types/ProcessState'
import { Schema, SchemaNode } from '../types/ProcessSchema'
import theme from '../Theme'

export type SizeProps = {
  node: SchemaNode
  schema: Schema
  state?: ProcessStateType
  subs: SubProcess[]
  theme: typeof theme
  level: number
}

export type SubProcess = {
  state: ProcessStateType
  schema: Schema
}

export type Dimensions = {
  width: number
  height: number
}

type ElementProps = SizeProps & {
  place: {
    x: number
    y: number
    width?: number
    height?: number
  }
  clickable?: boolean
  background?: string
}

type ElementInterface = {
  getSize?: (props: SizeProps) => Dimensions
} & React.FC<ElementProps>

export default ElementInterface
