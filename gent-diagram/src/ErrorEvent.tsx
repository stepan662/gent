import React, { useContext } from 'react'

import Context from './Context'

const CIRCLE_SIZE = 21

const LinkEvent = ({ edge, properties }) => {
  const { theme } = useContext(Context)

  const { x, y } = edge.points[0]
  const eventPosition = {
    x: x - CIRCLE_SIZE / 2,
    y: y - CIRCLE_SIZE / 2,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
  }

  if (properties.link_type === 'error') {
    return (
      <>
        <rect
          {...eventPosition}
          rx="50%"
          ry="50%"
          fill={theme.taskBackground}
          stroke={theme.taskBorder}
        />
        <text x={x} y={y} textAnchor="middle" alignmentBaseline="central" fontSize="13">
          {'!'}
        </text>
      </>
    )
  }
}

export default LinkEvent
