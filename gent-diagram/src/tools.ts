export const getTextWidth = (txt, font) => {
  const element = document.createElement('canvas')
  const context = element.getContext('2d')
  context.font = font
  return context.measureText(txt).width
}

export const calculateRectForText = (
  text: string,
  sizePx: number,
  font: string,
  padding: number[] = [0],
) => {
  return {
    width: getTextWidth(text, `${sizePx}px ${font}`) + (padding[1] || padding[0]) * 2,
    height: sizePx + padding[0] * 2,
  }
}

// draw unfinished circle
export function regularArcData(cx, cy, radius, startDegrees, endDegrees, isCounterClockwise) {
  var offsetRadians = -Math.PI / 2 // for 12 o'clock
  var sweepFlag = isCounterClockwise ? 0 : 1
  var startRadians = offsetRadians + (startDegrees * Math.PI) / 180
  var endRadians = offsetRadians + (endDegrees * Math.PI) / 180
  var largeArc = (endRadians - startRadians) % (2 * Math.PI) > Math.PI ? 1 : 0
  var startX = cx + radius * Math.cos(startRadians)
  var startY = cy + radius * Math.sin(startRadians)
  var endX = cx + radius * Math.cos(endRadians)
  var endY = cy + radius * Math.sin(endRadians)
  var space = ' '
  var arcData = ''

  arcData += 'M' + space + startX + space + startY + space
  arcData +=
    'A' +
    space +
    radius +
    space +
    radius +
    space +
    offsetRadians +
    space +
    largeArc +
    space +
    sweepFlag +
    space +
    endX +
    space +
    endY
  return arcData
}
