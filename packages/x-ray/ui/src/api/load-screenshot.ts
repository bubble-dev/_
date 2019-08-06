import { HOST, PORT } from '../config'
import { TFileType } from '../types'

export type TApiLoadScreenshotOpts = {
  file: string,
  type: TFileType,
  props: string,
}

export type TApiLoadScreenshotResult = {
  blob: Blob,
  width: number,
  height: number,
  dpr: number,
}

const apiLoadScreenshotCache = new Map<string, TApiLoadScreenshotResult>()

export const apiLoadScreenshot = async (opts: TApiLoadScreenshotOpts): Promise<TApiLoadScreenshotResult> => {
  const params = `file=${encodeURIComponent(opts.file)}&type=${opts.type}&item=${encodeURIComponent(opts.props)}`

  if (apiLoadScreenshotCache.has(params)) {
    return apiLoadScreenshotCache.get(params)!
  }

  const response = await fetch(`http://${HOST}:${PORT}/get?${params}`)

  if (!response.ok) {
    throw new Error(`Load snapshot (${response.status}): ${response.statusText}`)
  }

  const blob = await response.blob()
  const width = Number(response.headers.get('x-ray-width'))
  const height = Number(response.headers.get('x-ray-height'))
  const dpr = Number(response.headers.get('x-ray-dpr'))

  const result = {
    blob,
    width,
    height,
    dpr,
  }

  apiLoadScreenshotCache.set(params, result)

  return result
}
