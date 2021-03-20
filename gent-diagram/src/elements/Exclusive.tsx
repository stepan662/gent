import React from 'react'
import ElementInterface from './ElementInterface'

import { calculateRectForText } from './tools'

export const Exclusive: ElementInterface = ({
  node,
  place: { x, y, width, height, ...rest },
  clickable,
  background,
  theme,
}) => {
  const circledWidth = Math.sqrt((width * width) / 2)
  const center = {
    x: x + width / 2,
    y: y + width / 2,
  }

  const lPadding = 3
  const { width: lWidth, height: lHeight } = calculateRectForText(node.name || '', 12, theme.font, [
    lPadding,
  ])

  const lWidthHalf = lWidth / 2
  const rightOffsetLimit = width / 2 + 20
  const rightOffset = lWidthHalf < rightOffsetLimit ? lWidthHalf : rightOffsetLimit

  return (
    <React.Fragment>
      <rect
        fill={background}
        stroke={theme.taskBorder}
        transform={`rotate(45, ${x + width / 2}, ${y + height / 2})`}
        x={x + (width - circledWidth) / 2}
        y={y + (width - circledWidth) / 2}
        width={circledWidth}
        height={circledWidth}
        {...rest}
        {...clickable}
      />
      <rect
        x={x + width / 2 + rightOffset - lWidth + lPadding}
        y={y + height + theme.taskOuterSpace - lHeight / 2}
        width={lWidth}
        height={lHeight}
        fill={theme.taskOuterBackground}
      />
      <text
        x={x + width / 2 + rightOffset}
        y={y + height + theme.taskOuterSpace}
        textAnchor="end"
        {...clickable}
        fill={theme.taskOuterTextColor}
        alignmentBaseline="central"
        fontSize={theme.taskOuterFontSize}
      >
        {node.name}
      </text>
      <path
        d={`M ${center.x - width / 8} ${center.y - width / 8} L ${center.x + width / 8} ${
          center.y + width / 8
        }`}
        stroke={theme.taskInnerTextColor}
        {...clickable}
      />
      <path
        d={`M ${center.x + width / 8} ${center.y - width / 8} L ${center.x - width / 8} ${
          center.y + width / 8
        }`}
        stroke={theme.taskInnerTextColor}
        {...clickable}
      />
    </React.Fragment>
  )
}

Exclusive.getSize = () => {
  return {
    height: 40,
    width: 40,
  }
}
