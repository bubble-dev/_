import { TServerResult } from '@x-ray/common-utils'
import { HOST, PORT } from '../config'

export type TApiLoadListResult = TServerResult

export const apiLoadList = async (): Promise<TApiLoadListResult> => {
  const response = await fetch(`http://${HOST}:${PORT}/list`)

  if (!response.ok) {
    throw new Error(`Load list (${response.status}): ${response.statusText}`)
  }

  return response.json()
}
