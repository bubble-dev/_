import { TFileResultLine } from '@x-ray/snapshots'
import { HOST, PORT } from '../config'
import { TSnapshotFileType } from '../types'

export type TApiLoadSnapshotOpts = {
  file: string,
  type: TSnapshotFileType,
  id: string,
}

const apiLoadSnapshotCache = new Map<string, TFileResultLine[]>()

export const apiLoadSnapshot = async (opts: TApiLoadSnapshotOpts): Promise<TFileResultLine[]> => {
  const params = `file=${encodeURIComponent(opts.file)}&type=${opts.type}&id=${encodeURIComponent(opts.id)}`

  if (apiLoadSnapshotCache.has(params)) {
    return apiLoadSnapshotCache.get(params)!
  }

  const response = await fetch(`http://${HOST}:${PORT}/get?${params}`)

  if (!response.ok) {
    throw new Error(`Load snapshot (${response.status}): ${response.statusText}`)
  }

  const resultStr = await response.text()
  const result = JSON.parse(resultStr)

  apiLoadSnapshotCache.set(params, result)

  return result
}
