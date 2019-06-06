import { RGB } from '@fantasy-color/types'

export default ({ red, green, blue }: RGB): RGB => ({
  red: red / 255,
  green: green / 255,
  blue: blue / 255,
})
