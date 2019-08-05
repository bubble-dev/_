import { TItem } from '../types'

export const itemsSorter = (a: TItem, b: TItem): -1 | 0 | 1 => {
  if (a.file < b.file) {
    return -1
  }

  if (a.file > b.file) {
    return 1
  }

  if (a.file === b.file) {
    if (a.type < b.type) {
      return -1
    }

    if (a.type > b.type) {
      return 1
    }

    if (a.type === b.type) {
      if (a.name < b.name) {
        return -1
      }

      if (a.name > b.name) {
        return 1
      }
    }
  }

  return 0
}
