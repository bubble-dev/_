import { HSV, HSVA } from '@fantasy-color/types'

export default ({ hue, saturation, value }: HSV): HSVA => ({
  hue,
  saturation,
  value,
  alpha: 1,
})
