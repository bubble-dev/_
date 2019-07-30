import { TServerResult } from '@x-ray/common-utils'

const HOST = 'localhost'
const PORT = 3001

export const loadListApi = async (): Promise<TServerResult> => {
  const response = await fetch(`http://${HOST}:${PORT}/list`)

  if (!response.ok) {
    throw new Error(`Load list (${response.status}): ${response.statusText}`)
  }

  return response.json()
}

export const saveApi = async (): Promise<void> => {
  const response = await fetch(`http://${HOST}:${PORT}/save`, { method: 'POST' })

  if (!response.ok) {
    throw new Error(`Save (${response.status}): ${response.statusText}`)
  }
}
