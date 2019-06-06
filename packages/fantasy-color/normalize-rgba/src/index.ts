import { RGBA } from '@fantasy-color/types'

export default ({ red, green, blue, alpha }: RGBA): RGBA => ({
  red: red / 255,
  green: green / 255,
  blue: blue / 255,
  alpha,
})
