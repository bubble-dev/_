import { HOST, PORT } from '../config'

export const apiSave = async (): Promise<void> => {
  const response = await fetch(`http://${HOST}:${PORT}/save`, { method: 'POST' })

  if (!response.ok) {
    throw new Error(`Save (${response.status}): ${response.statusText}`)
  }
}
