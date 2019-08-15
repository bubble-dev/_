import path from 'path'
import http from 'http'
import upng from 'upng-js'
import { checkScreenshot, TResultData, TFileResultData, TRunScreesnotsResult } from '@x-ray/screenshot-utils'
import { TarFs, TTarFs, TTarDataWithMeta } from '@x-ray/tar-fs'
import { isUndefined, isString } from 'tsfn'
import { TResult, TFileResult } from '@x-ray/common-utils'
import { TOptions } from './types'

const shouldBailout = Boolean(process.env.XRAY_CI)
const dprSize = (dpr: number) => (size: number): number => Math.round(size / dpr * 100) / 100

export const runScreenshotsServer = (options: TOptions) => new Promise<() => Promise<TRunScreesnotsResult>>((serverResolve) => {
  const dpr = dprSize(options.dpr)
  const screenshotsPromise = new Promise<TRunScreesnotsResult>((screenshotsResolve, screenshotsReject) => {
    let currentTar: TTarFs
    let currentFilePath: string

    const result: TResult = {}
    const resultData: TResultData = {}
    let hasBeenChanged = false

    let targetResult: TFileResult = {
      old: {},
      new: {},
    }
    let targetResultData: TFileResultData = {
      old: {},
      new: {},
    }

    const onFileDone = async (tar: TTarFs, filePath: string) => {
      if (!isUndefined(tar)) {
        for (const itemName of tar.list()) {
          if (Reflect.has(targetResult.old, itemName)) {
            continue
          }

          const { data, meta } = await tar.read(itemName) as TTarDataWithMeta
          const { width, height } = upng.decode(data.buffer)

          targetResult.old[itemName] = {
            width: dpr(width),
            height: dpr(height),
            serializedElement: meta,
          }
          targetResultData.old[itemName] = data

          hasBeenChanged = true
        }
      }

      // target file DONE
      if (isString(filePath)) {
        const relativePath = path.relative(process.cwd(), filePath)
        result[relativePath] = targetResult
        resultData[relativePath] = targetResultData

        targetResult = {
          old: {},
          new: {},
        }
        targetResultData = {
          old: {},
          new: {},
        }
      }
    }

    const server = http
      .createServer(async (req, res) => {
        if (req.method === 'POST') {
          if (req.url === '/upload') {
            let body = ''

            req
              .on('data', (chunk) => {
                body += chunk
              })
              .on('end', async () => {
                const { data, path: filePath, id, serializedElement } = JSON.parse(body)
                const screenshotsDir = path.join(path.dirname(filePath), '__x-ray__')
                const screenshotsTarPath = path.join(screenshotsDir, `${options.platform}-screenshots.tar`)
                const screenshot = Buffer.from(data, 'base64')

                if (currentFilePath !== filePath) {
                  await onFileDone(currentTar, currentFilePath)

                  currentFilePath = filePath

                  if (!isUndefined(currentTar)) {
                    await currentTar.close()
                  }

                  currentTar = await TarFs(screenshotsTarPath)
                }

                const action = await checkScreenshot(screenshot, currentTar, id)

                if (shouldBailout && (action.type === 'DIFF' || action.type === 'NEW')) {
                  res.writeHead(500)
                  res.end()

                  return server.close(() => screenshotsReject(null)) // eslint-disable-line
                }

                // switch
                switch (action.type) {
                  case 'OK': {
                    break
                  }
                  case 'DIFF': {
                    targetResult.old[id] = {
                      serializedElement,
                      width: dpr(action.old.width),
                      height: dpr(action.old.height),
                    }
                    targetResult.new[id] = {
                      serializedElement,
                      width: dpr(action.new.width),
                      height: dpr(action.new.height),
                    }
                    targetResultData.old[id] = action.old.data
                    targetResultData.new[id] = action.new.data

                    hasBeenChanged = true

                    break
                  }
                  case 'NEW': {
                    targetResult.new[id] = {
                      serializedElement,
                      width: dpr(action.width),
                      height: dpr(action.height),
                    }
                    targetResultData.new[id] = action.data

                    hasBeenChanged = true

                    break
                  }
                }

                res.writeHead(200)
                res.end()
              })
          } else if (req.url === '/error') {
            let body = ''

            req
              .on('data', (chunk) => {
                body += chunk
              })
              .on('end', () => {
                console.error(body)

                res.writeHead(500)
                res.end()

                return server.close(() => screenshotsReject(null)) // eslint-disable-line
              })
          }
        } else {
          res.writeHead(200)
          res.end()

          if (req.url === '/done') {
            await onFileDone(currentTar, currentFilePath)

            if (!isUndefined(currentTar)) {
              await currentTar.close()
            }

            server.close(() => screenshotsResolve({
              result,
              resultData,
              hasBeenChanged,
            }))
          }
        }
      })
      .listen(3002, '127.0.0.1', () => {
        serverResolve(() => screenshotsPromise)
      })
  })
})
