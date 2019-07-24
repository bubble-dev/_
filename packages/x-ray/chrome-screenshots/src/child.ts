/* eslint-disable no-throw-literal, no-duplicate-case, no-fallthrough, import/no-unresolved */
import path from 'path'
import { parentPort, MessagePort } from 'worker_threads'
import puppeteer, { Page } from 'puppeteer-core'
import pAll from 'p-all'
import { TCheckRequest } from '@x-ray/common-utils'
import { checkScreenshot, TMeta } from '@x-ray/screenshot-utils'
import upng from 'upng-js'
import { TarFs } from '@x-ray/tar-fs'
import getScreenshot from './get'
import { TOptions } from './types'

const shouldBailout = Boolean(process.env.XRAY_CI)
const CONCURRENCY = 4
const port = parentPort as any as MessagePort

export default async (options: TOptions) => {
  try {
    const { dpr, width, height } = options

    const browser = await puppeteer.connect({
      browserWSEndpoint: options.webSocketDebuggerUrl,
      defaultViewport: {
        deviceScaleFactor: dpr,
        width,
        height,
      },
    } as any)

    const pagesPromises: Promise<Page>[] = []

    for (let i = 0; i < CONCURRENCY; ++i) {
      pagesPromises.push(browser.newPage())
    }

    const pages: Page[] = await Promise.all(pagesPromises)

    await new Promise((resolve, reject) => {
      port.on('message', async (action: TCheckRequest) => {
        try {
          switch (action.type) {
            case 'FILE': {
              const { default: items } = await import(action.path) as { default: TMeta[] }
              const screenshotsDir = path.join(path.dirname(action.path), '__x-ray__')
              const tar = await TarFs(path.join(screenshotsDir, 'chrome-screenshots.tar'))

              await pAll(
                items.map((item) => async () => {
                  const page = pages.shift() as Page
                  const screenshot = await getScreenshot(page, item)

                  const screenshotName = `${item.options.name}.png`

                  pages.push(page)

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
                }),
                { concurrency: pages.length }
              )

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

              await tar.close()

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
