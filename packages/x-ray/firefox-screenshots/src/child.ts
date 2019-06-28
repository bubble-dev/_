/* eslint-disable no-throw-literal */
import path from 'path'
import { promisify } from 'util'
import foxr from 'foxr'
import fs from 'graceful-fs'
import makeDir from 'make-dir'
import { TMessage } from '@x-ray/common-utils'
import { checkScreenshot, TMeta } from '@x-ray/screenshot-utils'
import { TarFs } from '@x-ray/next'
import getScreenshot from './get'
import { TOptions } from './types'

const pathExists = promisify(fs.access)
const shouldBailout = Boolean(process.env.XRAY_CI)

// @ts-ignore
const processSend: (message: TMessage) => Promise<void> = promisify(process.send.bind(process))

export default async (targetFiles: string[], options: TOptions) => {
  try {
    const { width, height } = options

    const browser = await foxr.connect({
      defaultViewport: {
        width,
        height,
      },
    })

    const page = await browser.newPage()

    for (const targetPath of targetFiles) {
      const { default: items } = await import(targetPath) as { default: TMeta[] }
      const screenshotsDir = path.join(path.dirname(targetPath), '__x-ray__')

      if (!shouldBailout) {
        try {
          await pathExists(screenshotsDir)
        } catch (e) {
          await makeDir(screenshotsDir)
        }
      }

      const tar = await TarFs(path.join(screenshotsDir, 'firefox-screenshots.tar'))

      for (const item of items) {
        const screenshot = await getScreenshot(page, item)
        const screenshotName = `${item.options.name}.png`
        const message = await checkScreenshot(screenshot, tar, screenshotName, shouldBailout)

        await processSend(message)

        if (shouldBailout && (message.status === 'diff' || message.status === 'unknown')) {
          throw null
        }
      }

      await tar.save()
    }

    await browser.disconnect()

    process.disconnect()
    process.exit(0) // eslint-disable-line
  } catch (err) {
    if (err !== null) {
      console.error(err)
    }

    process.disconnect()
    process.exit(1) // eslint-disable-line
  }
}
