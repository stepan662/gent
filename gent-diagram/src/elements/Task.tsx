import React from 'react'
import ElementInterface from './ElementInterface'
import { calculateRectForText } from './tools'

export const Task: ElementInterface = ({ node, place, clickable, background, theme }) => {
  const { x, y, width, height } = place

  return (
    <React.Fragment>
      <rect {...place} stroke={theme.taskBorder} fill={background}></rect>
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        alignmentBaseline="central"
        fill={theme.taskInnerTextColor}
        fontFamily={`${theme.taskInnerFontSize}px`}
      >
        {node.name}
      </text>
    </React.Fragment>
  )
}

Task.getSize = ({ theme, node }) => {
  return calculateRectForText(node.name || node.id, theme.taskInnerFontSize, theme.font, [18, 15])
}
