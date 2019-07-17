// @ts-ignore
import imageminPngout from 'imagemin-pngout'
import { TTarFs } from '@x-ray/tar-fs'
import upng from 'upng-js'
import { TCheckResult } from './types'
import hasPngDiff from './has-png-diff'

const optimizePng = imageminPngout({ strategy: 2 })

const checkScreenshot = async (data: Buffer, tar: TTarFs, screenshotName: string): Promise<TCheckResult> => {
  if (tar.has(screenshotName)) {
    const existingData = tar.read(screenshotName)

    const pngOld = upng.decode(existingData)
    const pngNew = upng.decode(data)

    if (!hasPngDiff(pngOld, pngNew)) {
      return {
        type: 'OK',
        path: screenshotName,
      }
    }

    const optimizedScreenshot = await optimizePng(data)

    return {
      type: 'DIFF',
      path: screenshotName,
      old: {
        data: existingData,
        width: pngOld.width,
        height: pngOld.height,
      },
      new: {
        data: optimizedScreenshot,
        width: pngNew.width,
        height: pngNew.height,
      },
    }
  }

  const pngNew = upng.decode(data)
  const optimizedScreenshot = await optimizePng(data)

  return {
    type: 'NEW',
    path: screenshotName,
    data: optimizedScreenshot,
    width: pngNew.width,
    height: pngNew.height,
  }
}

export default checkScreenshot
