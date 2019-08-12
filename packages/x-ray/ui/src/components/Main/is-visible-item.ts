import { TItem } from '../../types'

export const isVisibleItem = (item: TItem, top: number, height: number): boolean => {
  return (item.top + item.height > top) && (item.top < top + height)
}
