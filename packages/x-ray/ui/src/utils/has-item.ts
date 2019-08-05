import { TItem } from '../types'
import { isEqualItems } from './is-equal-items'

export const hasItem = (items: TItem[], targetItem: TItem) => {
  const index = items.findIndex((item) => isEqualItems(item, targetItem))

  return index !== -1
}
