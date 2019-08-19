import { TScreenshotsSave } from '@x-ray/screenshot-utils'
import { TSnapshotsSave } from '@x-ray/snapshots'
import { HOST, PORT } from '../config'
import { TScreenshotItem, TSnapshotItem, TType, TItem } from '../types'

const saveScreenshots = (items: TScreenshotItem[]): TScreenshotsSave => {
  return items.reduce((result, item) => {
    const file = result[item.file] || {}

    switch (item.type) {
      case 'new': {
        const ids: string[] = file.new || []

        result[item.file] = {
          ...file,
          new: ids.concat(item.id),
        }

        return result
      }

      case 'deleted': {
        const ids: string[] = file.old || []

        result[item.file] = {
          ...file,
          old: ids.concat(item.id),
        }

        return result
      }

      case 'diff': {
        const newIds: string[] = file.new || []
        const oldIds: string[] = file.old || []

        result[item.file] = {
          ...file,
          new: newIds.concat(item.id),
          old: oldIds.concat(item.id),
        }

        return result
      }
    }

    return result
  }, {} as TScreenshotsSave)
}

const saveSnapshots = (items: TSnapshotItem[]): TSnapshotsSave => {
  return items.reduce((result, item) => {
    const file = result[item.file] || {}

    switch (item.type) {
      case 'new': {
        const ids: string[] = file.new || []

        result[item.file] = {
          ...file,
          new: ids.concat(item.id),
        }

        return result
      }

      case 'deleted': {
        const ids: string[] = file.deleted || []

        result[item.file] = {
          ...file,
          deleted: ids.concat(item.id),
        }

        return result
      }

      case 'diff': {
        const ids: string[] = file.diff || []

        result[item.file] = {
          ...file,
          diff: ids.concat(item.id),
        }

        return result
      }
    }

    return result
  }, {} as TSnapshotsSave)
}

const isScreenshots = (type: TType, items: TItem[]): items is TScreenshotItem[] => type === 'image' && items.length > 0
const isSnapshots = (type: TType, items: TItem[]): items is TSnapshotItem[] => type === 'text' && items.length > 0

export const apiSave = async (type: TType, items: TItem[]): Promise<void> => {
  let data

  if (isScreenshots(type, items)) {
    data = saveScreenshots(items)
  } else if (isSnapshots(type, items)) {
    data = saveSnapshots(items)
  } else {
    throw new Error('Cannot save')
  }

  const response = await fetch(`http://${HOST}:${PORT}/save`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Save (${response.status}): ${response.statusText}`)
  }
}
