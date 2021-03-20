import React from 'react'
import { ProcessStateType } from './types/ProcessState'
import { Schema } from './types/ProcessSchema'
import theme from './Theme'
import Process from './elements/Process'

type Props = {
  schema: Schema
  state?: ProcessStateType
  subs: SubProcess[]
}

type SubProcess = {
  state: ProcessStateType
  schema: Schema
}

const Diagram = (props: Props) => {
  const dimensions = Process.getSize({ ...props, theme, node: null, level: 0 })

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
        theme={theme}
        node={null}
        place={{ x: 0, y: 0, ...dimensions }}
        level={0}
      />
    </svg>
  )
}

export default Diagram
