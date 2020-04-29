type PointType = {
  x: number
  y: number
}

export const middlePoint = (point1: PointType, point2: PointType): PointType => {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2,
  }
}

const drawCurve = (points: PointType[]) => {
  let path = ''
  for (let i = 0; i < points.length; i++) {
    const { x, y } = points[i]
    if (i === 0) {
      path += `M ${x}, ${y} `
    } else if (i === points.length - 1) {
      path += `${x}, ${y} `
    } else {
      const { x: middleX, y: middleY } = middlePoint(points[i - 1], points[i])
      path += `${middleX}, ${middleY} C ${x}, ${y}, ${x} ${y} `
    }
  }

  return path
}

export default drawCurve
