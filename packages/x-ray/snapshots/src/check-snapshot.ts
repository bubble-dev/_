import { TTarFs } from '@x-ray/tar-fs'
import { TCheckResult } from './types'

export const checkSnapshot = async (data: Buffer, tar: TTarFs, snapshotName: string): Promise<TCheckResult> => {
  if (tar.has(snapshotName)) {
    const existingData = await tar.read(snapshotName)

    if (existingData === null) {
      throw new Error(`Unable to read file "${snapshotName}"`)
    }

    if (Buffer.compare(data, existingData) === 0) {
      return {
        type: 'OK',
        path: snapshotName,
      }
    }

    return {
      type: 'DIFF',
      path: snapshotName,
      oldData: existingData,
      newData: data,
    }
  }

  return {
    type: 'NEW',
    path: snapshotName,
    data,
  }
}
