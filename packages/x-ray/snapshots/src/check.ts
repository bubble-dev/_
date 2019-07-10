import { TCheckResult } from '@x-ray/common-utils'
import { TTarFs } from '@x-ray/tar-fs'

const check = (data: string, tar: TTarFs, snapshotName: string, shouldBailout: boolean): TCheckResult => {
  if (tar.has(snapshotName)) {
    const existingData = tar.read(snapshotName)

    const dataBuffer = Buffer.from(data)

    if (Buffer.compare(dataBuffer, existingData) === 0) {
      return {
        status: 'ok',
        path: snapshotName,
      }
    }

    if (shouldBailout) {
      return {
        status: 'diff',
        path: snapshotName,
      }
    }

    tar.write(snapshotName, dataBuffer)

    return {
      status: 'diff',
      path: snapshotName,
    }
  }

  if (shouldBailout) {
    return {
      status: 'unknown',
      path: snapshotName,
    }
  }

  tar.write(snapshotName, Buffer.from(data))

  return {
    status: 'new',
    path: snapshotName,
  }
}

export default check
