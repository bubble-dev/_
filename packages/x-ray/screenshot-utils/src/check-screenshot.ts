// @ts-ignore
import imageminPngout from 'imagemin-pngout'
import { TCheckResult } from '@x-ray/common-utils'
import { TTarFs } from '@x-ray/tar-fs'
import hasPngDiff from './has-png-diff'

const optimizePng = imageminPngout({ strategy: 2 })

const checkScreenshot = async (data: Buffer, tar: TTarFs, screenshotName: string): Promise<TCheckResult> => {
  if (tar.has(screenshotName)) {
    const existingData = tar.read(screenshotName)

    if (!hasPngDiff(existingData, data)) {
      return {
        type: 'OK',
        path: screenshotName,
      }
    }

    const optimizedScreenshot = await optimizePng(data)

    return {
      type: 'DIFF',
      path: screenshotName,
      data: optimizedScreenshot,
    }
  }

  const optimizedScreenshot = await optimizePng(data)

  return {
    type: 'NEW',
    path: screenshotName,
    data: optimizedScreenshot,
  }
}

export default checkScreenshot
