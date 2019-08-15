import { HOST, PORT } from '../config'
import { TFileType } from '../types'

const apiLoadScreenshotCache = new Map<string, Blob>()

export type TApiLoadScreenshotOpts = {
  file: string,
  id: string,
  type: TFileType,
}

export const apiLoadScreenshot = async (opts: TApiLoadScreenshotOpts): Promise<Blob> => {
  const params = `file=${encodeURIComponent(opts.file)}&type=${opts.type}&id=${encodeURIComponent(opts.id)}`

  if (apiLoadScreenshotCache.has(params)) {
    return apiLoadScreenshotCache.get(params)!
  }

  const response = await fetch(`http://${HOST}:${PORT}/get?${params}`)

  if (!response.ok) {
    throw new Error(`Load screenshot (${response.status}): ${response.statusText}`)
  }

  const blob = await response.blob()

  apiLoadScreenshotCache.set(params, blob)

  return blob
}
