import React, { useContext } from 'react'
import Context from './Context'
import drawCurve from './curvePath'
import { calculateRectForText } from './tools'

const Link = ({ position, properties }) => {
  const { theme } = useContext(Context)

  const points = position.points

  let path = drawCurve(points)

  const secLast = points[points.length - 2]
  const last = points[points.length - 1]

  const angle = (Math.atan2(last.y - secLast.y, last.x - secLast.x) * 180) / Math.PI

  const paddingH = 6
  const paddingV = 4

  return (
    <React.Fragment>
      <path d={path} fill="transparent" stroke={theme.connectionLine} />
      <path
        d={`M ${last.x + 1} ${last.y} L ${last.x - 10} ${last.y - 4} L ${last.x - 10} ${last.y +
          4}`}
        fill={theme.connectionLine}
        transform={`rotate(${Math.round(angle)}, ${last.x}, ${last.y})`}
      />
      {position.width && (
        <>
          <rect
            width={position.width + paddingH * 2}
            height={position.height + paddingV * 2}
            x={position.x - position.width / 2 - paddingH}
            y={position.y - position.height / 2 - paddingV}
            fill={theme.connectionLabelBackground}
            rx={position.height}
          />
          <text
            x={position.x}
            y={position.y}
            fill={theme.connectionLabelColor}
            textAnchor="middle"
            alignmentBaseline="central"
            fontSize={theme.connectionLabelFontSize}
          >
            {properties.name}
          </text>
        </>
      )}
    </React.Fragment>
  )
}

Link.getSize = (connection, theme) => {
  return calculateRectForText(connection.name || '', theme.connectionLabelFontSize, theme.font)
}

export default Link
