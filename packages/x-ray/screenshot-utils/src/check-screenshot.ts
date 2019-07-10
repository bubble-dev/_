// @ts-ignore
import imageminPngout from 'imagemin-pngout'
import { TCheckResult } from '@x-ray/common-utils'
import { TTarFs } from '@x-ray/tar-fs'
import hasPngDiff from './has-png-diff'

const optimizePng = imageminPngout({ strategy: 2 })

const checkScreenshot = async (data: Buffer, tar: TTarFs, screenshotName: string, shouldBailout: boolean): Promise<TCheckResult> => {
  if (tar.has(screenshotName)) {
    const existingData = tar.read(screenshotName)

    if (!hasPngDiff(existingData, data)) {
      return {
        status: 'ok',
        path: screenshotName,
      }
    }

    if (shouldBailout) {
      return {
        status: 'diff',
        path: screenshotName,
      }
    }

    const optimizedScreenshot = await optimizePng(data)
    tar.write(screenshotName, optimizedScreenshot)

    return {
      status: 'diff',
      path: screenshotName,
    }
  }

  if (shouldBailout) {
    return {
      status: 'unknown',
      path: screenshotName,
    }
  }

  const optimizedScreenshot = await optimizePng(data)
  tar.write(screenshotName, optimizedScreenshot)

  return {
    status: 'new',
    path: screenshotName,
  }
}

export default checkScreenshot
