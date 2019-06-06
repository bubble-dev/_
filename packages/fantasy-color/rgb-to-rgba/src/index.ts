import { RGB, RGBA } from '@fantasy-color/types'

export default ({ red, green, blue }: RGB): RGBA => ({
  red,
  green,
  blue,
  alpha: 1,
})
