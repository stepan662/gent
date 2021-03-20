import React from 'react'
import { ProcessStateType } from '../types/ProcessState'
import { Schema, SchemaNode } from '../types/ProcessSchema'
import theme from '../Theme'
import { DiagramOptions } from '../Diagram'

export type SizeProps = {
  node?: SchemaNode
  schema: Schema
  state?: ProcessStateType
  subs: SubProcess[]
  theme: typeof theme
  level: number
  options: DiagramOptions
  getProcessSize: SizeFunc
}

export type SizeFunc = (props: SizeProps) => Dimensions

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
  getSize?: SizeFunc
} & React.FC<ElementProps>

export default ElementInterface
