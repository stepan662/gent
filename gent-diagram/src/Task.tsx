import React, { useContext } from 'react'
import Context from './Context'
import { calculateRectForText } from './tools'

const Task = ({ data, place, clickable, background }) => {
  const { theme } = useContext(Context)

  const { x, y, width, height } = place

  return (
    <React.Fragment>
      <rect {...clickable} {...place} stroke={theme.taskBorder} fill={background}></rect>
      <text
        {...clickable}
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        alignmentBaseline="central"
        fill={theme.taskInnerTextColor}
        fontFamily={theme.taskInnerFontSize}
      >
        {data.name}
      </text>
    </React.Fragment>
  )
}

Task.getSize = (task, theme) => {
  return calculateRectForText(task.name || task.id, theme.taskInnerFontSize, theme.font, [18, 15])
}

export default Task
