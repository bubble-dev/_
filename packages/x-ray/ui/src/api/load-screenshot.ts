// import { HOST, PORT } from '../config'
import { TFileType, TSize } from '../types'

const apiLoadScreenshotCache = new Map<string, Blob>()

export type TApiLoadScreenshotOpts = {
  file: string,
  props: string,
  type: TFileType,
} & TSize

export const getScreenshotUrl = (opts: TApiLoadScreenshotOpts) => {
  return `https://placeimg.com/${Math.floor(opts.width)}/${Math.floor(opts.height)}/animals`
}

export const apiLoadScreenshot = async (opts: TApiLoadScreenshotOpts): Promise<Blob> => {
  // const params = `file=${encodeURIComponent(item.file)}&type=${item.type}&item=${encodeURIComponent(item.props)}`
  const params = JSON.stringify(opts)

  if (apiLoadScreenshotCache.has(params)) {
    return apiLoadScreenshotCache.get(params)!
  }

  // const response = await fetch(`http://${HOST}:${PORT}/get?${params}`)
  const response = await fetch(`https://placeimg.com/${Math.floor(opts.width)}/${Math.floor(opts.height)}/animals`, {
    // mode: 'no-cors',
  })

  console.log(response)

  if (!response.ok) {
    throw new Error(`Load screenshot (${response.status}): ${response.statusText}`)
  }

  const blob = await response.blob()

  apiLoadScreenshotCache.set(params, blob)

  return blob
}
