import type { TWritable } from 'tsfn'
import type { TColor } from '../../colors'
import type { TAnimationMapFn, TEasingFn } from './types'

export const easeColor = (easingFn: TEasingFn): TAnimationMapFn<TColor> => (from, to, time) => {
  const res = from.slice() as TWritable<TColor>

  for (let i = 0; i < 4; i++) {
    res[i] = easingFn(to[i] - from[i], time) + from[i]
  }

  return res
}
