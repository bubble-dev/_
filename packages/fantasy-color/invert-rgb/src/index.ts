import { RGB } from '@fantasy-color/types/src'

export default ({ red, green, blue }: RGB): RGB => ({
  red: 255 - red,
  green: 255 - green,
  blue: 255 - blue,
})
