/* eslint-disable promise/param-names */
import path from 'path'
import http from 'http'
import { promisify } from 'util'
import fs from 'graceful-fs'
import makeDir from 'make-dir'
import { makeLogger, logTotalResults } from '@x-ray/common-utils'
import { checkScreenshot } from '@x-ray/screenshot-utils'
import { TarFs, TTarFs } from '@x-ray/tar-fs'
import { isUndefined } from 'tsfn'
import { TOptions } from './types'

const shouldBailout = Boolean(process.env.XRAY_CI)
const pathExists = promisify(fs.access)

const runServer = (options: TOptions) => new Promise<() => Promise<void>>((serverResolve) => {
  const screenshotsPromise = new Promise<void>((screenshotsResolve, screenshotsReject) => {
    const logger = makeLogger()
    const existingDirs: string[] = []

    let currentTarPath: string
    let currentTar: TTarFs

    const server = http
      .createServer(async (req, res) => {
        if (req.method === 'POST' && req.url === '/upload') {
          let body = ''

          req
            .on('data', (chunk) => {
              body += chunk
            })
            .on('end', async () => {
              const { data, path: filePath, name } = JSON.parse(body)
              const screenshotsDir = path.join(path.dirname(filePath), '__x-ray__')
              const screenshotsTarPath = path.join(screenshotsDir, `${options.platform}-screenshots.tar`)
              const screenshotName = path.join(`${name}.png`)
              const screenshot = Buffer.from(data, 'base64')

              if (currentTarPath !== screenshotsTarPath) {
                currentTarPath = screenshotsTarPath

                if (!isUndefined(currentTar)) {
                  await currentTar.save()
                }

                currentTar = await TarFs(currentTarPath)
              }

              if (!shouldBailout) {
                try {
                  if (!existingDirs.includes(screenshotsDir)) {
                    await pathExists(screenshotsDir)
                    existingDirs.push(screenshotsDir)
                  }
                } catch (e) {
                  await makeDir(screenshotsDir)
                  existingDirs.push(screenshotsDir)
                }
              }

              const result = await checkScreenshot(screenshot, currentTar, screenshotName, shouldBailout)

              logger.log(result)

              if (shouldBailout && (result.status === 'diff' || result.status === 'unknown')) {
                res.writeHead(500)
                res.end()

                return server.close(() => screenshotsReject(null)) // eslint-disable-line
              }

              res.writeHead(200)
              res.end()
            })
        } else {
          res.writeHead(200)
          res.end()

          if (req.url === '/done') {
            logTotalResults([logger.totalResult()])

            if (!isUndefined(currentTar)) {
              await currentTar.save()
            }

            server.close(() => {
              screenshotsResolve()
            })
          }
        }
      })
      .listen(3002, '127.0.0.1', () => {
        serverResolve(() => screenshotsPromise)
      })
  })
})

export default runServer
