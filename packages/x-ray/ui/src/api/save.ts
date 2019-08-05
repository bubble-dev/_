import { TResult } from '@x-ray/common-utils'
import { HOST, PORT } from '../config'
import { TItem } from '../types'

export const apiSave = async (items: TItem[]): Promise<void> => {
  const data = items.reduce((result, item) => {
    const file = result[item.file] || {}
    const names = file[item.type] || []

    result[item.file] = {
      ...file,
      [item.type]: names.concat(item.name),
    }

    return result
  }, {} as TResult)

  const response = await fetch(`http://${HOST}:${PORT}/save`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Save (${response.status}): ${response.statusText}`)
  }
}
