import { TItem } from '../types'

export const isEqualItems = (a: TItem, b: TItem) => {
  return a.file === b.file && a.type === b.type && a.name === b.name
}
