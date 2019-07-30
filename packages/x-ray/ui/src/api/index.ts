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

export type TLoadSnapshotApiOpts = {
  file: string,
  type: string,
  item: string,
}

export type TLoadSnapshotApiResult = Promise<string>

export const loadSnapshotApi = async (opts: TLoadSnapshotApiOpts): TLoadSnapshotApiResult => {
  const response = await fetch(`http://${HOST}:${PORT}/get?file=${encodeURIComponent(opts.file)}&type=${opts.type}&item=${encodeURIComponent(opts.item)}`)

  if (!response.ok) {
    throw new Error(`Load snapshot (${response.status}): ${response.statusText}`)
  }

  return response.text()
}

export type TLoadScreenshotApiOpts = {
  file: string,
  type: string,
  item: string,
}

export type TLoadScreenshotApiResult = Promise<{
  url: string,
  width: number,
  height: number,
  dpr: number,
}>

export const loadScreenshotApi = async (opts: TLoadScreenshotApiOpts): TLoadScreenshotApiResult => {
  const response = await fetch(`http://${HOST}:${PORT}/get?file=${encodeURIComponent(opts.file)}&type=${opts.type}&item=${encodeURIComponent(opts.item)}`)

  if (!response.ok) {
    throw new Error(`Load snapshot (${response.status}): ${response.statusText}`)
  }

  const width = Number(response.headers.get('x-ray-width'))
  const height = Number(response.headers.get('x-ray-height'))
  const dpr = Number(response.headers.get('x-ray-dpr'))
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)

  return {
    url,
    width,
    height,
    dpr,
  }
}

export const saveApi = async (): Promise<void> => {
  const response = await fetch(`http://${HOST}:${PORT}/save`, { method: 'POST' })

  if (!response.ok) {
    throw new Error(`Save (${response.status}): ${response.statusText}`)
  }
}
