import { HSV, HSVA } from '@fantasy-color/types'

export default ({ hue, saturation, value }: HSVA): HSV => ({
  hue,
  saturation,
  value,
})
