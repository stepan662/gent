import React from 'react'
import ElementInterface from './ElementInterface'

export const Start: ElementInterface = ({ node, place, clickable, background, theme }) => {
  const smallerSize = 0.75

  const smallerCircle = {
    x: place.x + (place.width - place.width * smallerSize) / 2,
    y: place.y + (place.width - place.width * smallerSize) / 2,
    width: place.width * smallerSize,
    height: place.height * smallerSize,
  }

  const { x, y, height } = place
  return (
    <React.Fragment>
      <rect
        {...place}
        rx="50%"
        ry="50%"
        {...clickable}
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
      <text
        x={x}
        y={y + height + theme.taskOuterSpace}
        {...clickable}
        fill={theme.taskOuterTextColor}
        alignmentBaseline="central"
        fontSize={theme.taskOuterFontSize}
      >
        {node.name}
      </text>
    </React.Fragment>
  )
}

Start.getSize = () => {
  return {
    height: 40,
    width: 40,
  }
}
