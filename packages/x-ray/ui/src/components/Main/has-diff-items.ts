import { TItem } from '../../types'
import { isVisibleItem } from './is-visible-item'

export const hasDiffItems = (cols: TItem[][], top: number, height: number): boolean => {
  for (const col of cols) {
    for (const item of col) {
      if (isVisibleItem(item, top, height) && item.type === 'diff') {
        return true
      }
    }
  }

  return false
}
