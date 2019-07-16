/* eslint-disable no-throw-literal, no-duplicate-case, no-fallthrough, import/no-unresolved */
import path from 'path'
import { parentPort, MessagePort } from 'worker_threads'
import puppeteer, { Page } from 'puppeteer-core'
import pAll from 'p-all'
import makeDir from 'make-dir'
import { TCheckRequest } from '@x-ray/common-utils'
import { checkScreenshot, TMeta } from '@x-ray/screenshot-utils'
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

    port.on('message', async (action: TCheckRequest) => {
      try {
        switch (action.type) {
          case 'FILE': {
            const { default: items } = await import(action.path) as { default: TMeta[] }
            const screenshotsDir = path.join(path.dirname(action.path), '__x-ray__')

            await makeDir(screenshotsDir)

            const tar = await TarFs(path.join(screenshotsDir, 'chrome-screenshots.tar'))

            await pAll(
              items.map((item) => async () => {
                const page = pages.shift() as Page
                const screenshot = await getScreenshot(page, item)
                const screenshotName = `${item.options.name}.png`

                pages.push(page)

                const message = await checkScreenshot(screenshot, tar, screenshotName)

                switch (message.type) {
                  case 'OK': {
                    return port.postMessage(message)
                  }
                  case 'DIFF':
                  case 'NEW': {
                    if (shouldBailout) {
                      await browser.disconnect()

                      port.postMessage({
                        type: 'BAILOUT',
                        path: message.path,
                      })

                      throw null
                    }
                  }
                  case 'DIFF': {
                    // return port.postMessage(message, [message.data!.buffer])
                    return port.postMessage(message)
                  }
                  case 'NEW': {
                    // return port.postMessage(message, [message.data!.buffer])
                    return port.postMessage(message)
                  }
                }
              }),
              { concurrency: pages.length }
            )

            return port.postMessage({
              type: 'DONE',
              path: action.path,
            })
          }
          case 'DONE': {
            // await browser.disconnect()
            port.close()
          }
        }
      } catch (err) {
        if (err !== null) {
          port.postMessage({
            type: 'ERROR',
            data: err.message,
          })
        }
      }
    })
  } catch (err) {
    port.postMessage({
      type: 'ERROR',
      data: err.message,
    })
  }
}
