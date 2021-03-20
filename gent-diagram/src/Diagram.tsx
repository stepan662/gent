import React, { useMemo } from 'react'
import { ProcessStateType } from './types/ProcessState'
import { Schema } from './types/ProcessSchema'
import theme from './Theme'
import Process from './elements/Process'
import { Dimensions, SizeFunc, SizeProps } from './elements/ElementInterface'

export type DiagramOptions = {
  onRequestSubprocess?: (ids: string[]) => void
  allowedLevel?: number
}

type Props = DiagramOptions & {
  schema: Schema
  state?: ProcessStateType
  subs: SubProcess[]
}

type SubProcess = {
  state: ProcessStateType
  schema: Schema
}

const processSizeCacher = (): SizeFunc => {
  const cache: Map<string, Dimensions> = new Map()
  return (props) => {
    const key = props.state.id
    if (!cache[key]) {
      cache[key] = Process.getSize(props)
    }
    return cache[key]
  }
}

const Diagram = ({ allowedLevel = 0, onRequestSubprocess, ...props }: Props) => {
  // cache process layout, so we don't recalculate unnecessarly wich dagre
  const getProcessSize = useMemo(() => processSizeCacher(), [props?.state?.id, props.subs?.length])
  const options = {
    allowedLevel,
    onRequestSubprocess,
  }
  const dimensions = getProcessSize({
    ...props,
    theme,
    node: null,
    level: 0,
    options,
    getProcessSize,
  })

  return (
    <svg
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        fontFamily: theme.font,
        maxWidth: dimensions.width,
        maxHeight: dimensions.height,
        minWidth: dimensions.width / 1.5,
        minHeight: dimensions.height / 1.5,
        left: 0,
        right: 0,
        fontSize: 12,
      }}
    >
      <Process
        {...props}
        getProcessSize={getProcessSize}
        theme={theme}
        node={null}
        place={{ x: 0, y: 0, ...dimensions }}
        level={0}
        options={options}
      />
    </svg>
  )
}

export default Diagram
