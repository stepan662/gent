import React from 'react'
import ElementInterface from './ElementInterface'

import { calculateRectForText } from './tools'

export const End: ElementInterface = ({ node, place, clickable, background, theme }) => {
  const smallerSize = 0.75

  const smallerCircle = {
    x: place.x + (place.width - place.width * smallerSize) / 2,
    y: place.y + (place.width - place.width * smallerSize) / 2,
    width: place.width * smallerSize,
    height: place.height * smallerSize,
  }

  const { x, y, width, height } = place

  const lPadding = 3
  const { width: lWidth, height: lHeight } = calculateRectForText(node.name || '', 12, theme.font, [
    lPadding,
  ])

  return (
    <React.Fragment>
      <rect
        {...place}
        {...clickable}
        rx="50%"
        ry="50%"
        fill={theme.taskBackground}
        stroke={theme.taskBorder}
      />
      <rect
        {...smallerCircle}
        {...clickable}
        rx="50%"
        ry="50%"
        fill={background}
        stroke={background}
      />
      <rect
        x={x + width - lWidth + lPadding}
        y={y + height + theme.taskOuterSpace - lHeight / 2}
        width={lWidth}
        height={lHeight}
        fill={theme.taskOuterBackground}
        opacity="0.5"
      />
      <text
        x={x + width}
        y={y + height + theme.taskOuterSpace}
        {...clickable}
        textAnchor="end"
        fill={theme.taskOuterTextColor}
        alignmentBaseline="central"
        fontSize={theme.taskOuterFontSize}
      >
        {node.name}
      </text>
    </React.Fragment>
  )
}

End.getSize = () => {
  return {
    height: 40,
    width: 40,
  }
}
