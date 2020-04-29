import React, { useContext } from 'react'
import Context from './Context'

import { calculateRectForText } from './tools'

const End = ({ data, place, clickable, background }) => {
  const smallerSize = 0.75

  const smallerCircle = {
    x: place.x + (place.width - place.width * smallerSize) / 2,
    y: place.y + (place.width - place.width * smallerSize) / 2,
    width: place.width * smallerSize,
    height: place.height * smallerSize,
  }

  const { theme } = useContext(Context)

  const { x, y, width, height } = place

  const lPadding = 3
  const { width: lWidth, height: lHeight } = calculateRectForText(data.name || '', 12, theme.font, [
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
        {data.name}
      </text>
    </React.Fragment>
  )
}

End.getSize = (data, state) => {
  return {
    height: 40,
    width: 40,
  }
}

export default End
