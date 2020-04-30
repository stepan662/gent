import React, { useContext, useState, useEffect, useMemo } from 'react'

import Context from './Context'
import { regularArcData } from './tools'

const CIRCLE_SIZE = 21
const SMALL_CIRCLE_SIZE = 8
const PROGRESS_RADIUS = 7

const computeAngle = (event, time) =>
  Math.max(
    Math.min(((time - event.created) / (event.deploy_time - event.created)) * 360, 359.99),
    0,
  )

const TimeoutEvent = ({ edge, properties, state }) => {
  const [time, setTime] = useState(Date.now())

  const active = useMemo(() => {
    if (state?.task === properties.from && state?.subtask === 'timeout') {
      return true
    }
    return false
  }, [state, properties])

  const event = useMemo(() => {
    const taskId = state?.task
    if (taskId !== properties.from) {
      return null
    }
    return state.events.find((e) => e.task === taskId && e.subtask === 'timeout')
  }, [state, properties])

  useEffect(() => {
    if (event) {
      const timeout = setTimeout(() => setTime(Date.now()), 1000)
      return () => clearTimeout(timeout)
    }
  })

  const angle = event && computeAngle(event, Date.now())

  const { theme } = useContext(Context)

  const { x, y } = edge.points[0]
  const eventPosition = {
    x: x - CIRCLE_SIZE / 2,
    y: y - CIRCLE_SIZE / 2,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
  }

  const smallCirclePosition = {
    x: x - SMALL_CIRCLE_SIZE / 2,
    y: y - SMALL_CIRCLE_SIZE / 2,
    width: SMALL_CIRCLE_SIZE,
    height: SMALL_CIRCLE_SIZE,
  }

  return (
    <>
      <rect
        {...eventPosition}
        rx="50%"
        ry="50%"
        fill={theme.taskBackground}
        stroke={theme.taskBorder}
      />
      {event && (
        <>
          <path
            d={regularArcData(x, y, PROGRESS_RADIUS, 0, angle, false)}
            stroke="red"
            fill="transparent"
            strokeWidth="7"
          />
          <rect {...eventPosition} rx="50%" ry="50%" fill="transparent" stroke={theme.taskBorder} />
        </>
      )}
      {active && (
        <rect
          {...eventPosition}
          rx="50%"
          ry="50%"
          fill={theme.taskRunningBackground}
          stroke={theme.taskBorder}
        />
      )}
      <rect {...smallCirclePosition} fill="black" rx="50%" />
    </>
  )
}

export default TimeoutEvent
