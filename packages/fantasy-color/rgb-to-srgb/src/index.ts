import { RGB } from '@fantasy-color/types/src'
import normalizeRGB from '@fantasy-color/normalize-rgb'

const NORMALIZED_BELOW_10 = 0.03928

const toSRGB = (normalized: number) =>
  (normalized > NORMALIZED_BELOW_10
    ? Math.pow(((normalized + 0.055) / 1.055), 2.4)
    : normalized / 12.92)

export default (color: RGB): RGB => {
  const { red, green, blue } = normalizeRGB(color)

  return {
    red: toSRGB(red),
    green: toSRGB(green),
    blue: toSRGB(blue),
  }
}
