import { TScreenshotItem } from '../types'

export const screenshotsSorter = (a: TScreenshotItem, b: TScreenshotItem): -1 | 0 | 1 => {
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
      if (a.id.length < b.id.length) {
        return -1
      }

      if (a.id.length > b.id.length) {
        return 1
      }
    }
  }

  return 0
}
