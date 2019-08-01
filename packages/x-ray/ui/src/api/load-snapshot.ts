import { HOST, PORT } from '../config'

export type TApiLoadSnapshotOpts = {
  file: string,
  type: string,
  item: string,
}

export type TApiLoadSnapshotResult = string

const apiLoadSnapshotCache = new Map<string, TApiLoadSnapshotResult>()

export const apiLoadSnapshot = async (opts: TApiLoadSnapshotOpts): Promise<TApiLoadSnapshotResult> => {
  const params = `file=${encodeURIComponent(opts.file)}&type=${opts.type}&item=${encodeURIComponent(opts.item)}`

  if (apiLoadSnapshotCache.has(params)) {
    return apiLoadSnapshotCache.get(params)!
  }

  const response = await fetch(`http://${HOST}:${PORT}/get?${params}`)

  if (!response.ok) {
    throw new Error(`Load snapshot (${response.status}): ${response.statusText}`)
  }

  const result = await response.text()

  apiLoadSnapshotCache.set(params, result)

  return result
}
