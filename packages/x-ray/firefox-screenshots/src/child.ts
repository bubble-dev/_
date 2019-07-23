/* eslint-disable no-throw-literal, no-duplicate-case, no-fallthrough, import/no-unresolved */
import path from 'path'
import { parentPort, MessagePort } from 'worker_threads'
import foxr from 'foxr'
import upng from 'upng-js'
import { checkScreenshot, TMeta } from '@x-ray/screenshot-utils'
import { TarFs } from '@x-ray/tar-fs'
import { TCheckRequest } from '@x-ray/common-utils'
import getScreenshot from './get'
import { TOptions } from './types'

const shouldBailout = Boolean(process.env.XRAY_CI)
const port = parentPort as any as MessagePort

export default async (options: TOptions) => {
  try {
    const { width, height } = options

    const browser = await foxr.connect({
      defaultViewport: {
        width,
        height,
      },
    })

    const page = await browser.newPage()

    await new Promise((resolve, reject) => {
      port.on('message', async (action: TCheckRequest) => {
        try {
          switch (action.type) {
            case 'FILE': {
              const { default: items } = await import(action.path) as { default: TMeta[] }
              const screenshotsDir = path.join(path.dirname(action.path), '__x-ray__')
              const tar = await TarFs(path.join(screenshotsDir, 'firefox-screenshots.tar'))

              for (const item of items) {
                const screenshot = await getScreenshot(page, item)
                const screenshotName = `${item.options.name}.png`
                const message = await checkScreenshot(screenshot, tar, screenshotName)

                switch (message.type) {
                  case 'DIFF':
                  case 'NEW': {
                    if (shouldBailout) {
                      await browser.disconnect()

                      port.postMessage({
                        type: 'BAILOUT',
                        path: message.path,
                      })

                      port.close()

                      throw null
                    }
                  }
                }

                switch (message.type) {
                  case 'OK': {
                    port.postMessage(message)

                    break
                  }
                  case 'DIFF': {
                    port.postMessage(message)

                    break
                  }
                  case 'NEW': {
                    port.postMessage(message)

                    break
                  }
                }
              }

              for (const item of tar.list()) {
                if (!items.find((metaItem) => `${metaItem.options.name}.png` === item)) {
                  const data = await tar.read(item) as Buffer
                  const { width, height } = upng.decode(data)

                  port.postMessage({
                    type: 'DELETED',
                    path: item,
                    data,
                    width,
                    height,
                  })
                }
              }

              port.postMessage({
                type: 'DONE',
                path: action.path,
              })

              break
            }
            case 'DONE': {
              await browser.disconnect()
              port.close()
              resolve()
            }
          }
        } catch (err) {
          reject(err)
        }
      })
    })
  } catch (err) {
    console.error(err)

    if (err !== null) {
      port.postMessage({
        type: 'ERROR',
        data: err.message,
      })
    }
  }
}
