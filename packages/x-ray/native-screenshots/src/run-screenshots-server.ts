/* eslint-disable promise/param-names */
import path from 'path'
import http from 'http'
import upng from 'upng-js'
import { checkScreenshot, TResultData, TFileResultData, TRunScreesnotsResult } from '@x-ray/screenshot-utils'
import { TarFs, TTarFs } from '@x-ray/tar-fs'
import { isUndefined, isString } from 'tsfn'
import { TResult, TFileResult } from '@x-ray/common-utils'
import { TOptions } from './types'

const shouldBailout = Boolean(process.env.XRAY_CI)

export const runScreenshotsServer = (options: TOptions) => new Promise<() => Promise<TRunScreesnotsResult>>((serverResolve) => {
  const screenshotsPromise = new Promise<TRunScreesnotsResult>((screenshotsResolve, screenshotsReject) => {
    let currentTar: TTarFs
    let currentFilePath: string

    const result: TResult = {}
    const resultData: TResultData = {}
    let hasBeenChanged = false

    let targetResult: TFileResult = {
      ok: [],
      diff: [],
      new: [],
      deleted: [],
    }
    let targetResultData: TFileResultData = {
      old: {},
      new: {},
    }

    const onFileDone = async (tar: TTarFs, filePath: string) => {
      if (!isUndefined(tar)) {
        for (const itemName of tar.list()) {
          if (targetResult.ok.includes(itemName) || targetResult.diff.includes(itemName)) {
            continue
          }

          const data = await tar.read(itemName) as Buffer
          const { width, height } = upng.decode(data)

          targetResult.deleted.push(itemName)
          targetResultData.old[itemName] = {
            data: Buffer.from(data),
            width,
            height,
          }

          hasBeenChanged = true
        }
      }

      // target file DONE
      if (isString(filePath)) {
        const relativePath = path.relative(process.cwd(), filePath)
        result[relativePath] = targetResult
        resultData[relativePath] = targetResultData

        targetResult = {
          ok: [],
          diff: [],
          new: [],
          deleted: [],
        }
        targetResultData = {
          old: {},
          new: {},
        }
      }
    }

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

              if (currentFilePath !== filePath) {
                await onFileDone(currentTar, currentFilePath)

                currentFilePath = filePath

                if (!isUndefined(currentTar)) {
                  await currentTar.close()
                }

                currentTar = await TarFs(screenshotsTarPath)
              }

              const action = await checkScreenshot(screenshot, currentTar, screenshotName)

              if (shouldBailout && (action.type === 'DIFF' || action.type === 'NEW')) {
                res.writeHead(500)
                res.end()

                return server.close(() => screenshotsReject(null)) // eslint-disable-line
              }

              // switch
              switch (action.type) {
                case 'OK': {
                  targetResult.ok.push(action.path)

                  break
                }
                case 'DIFF': {
                  targetResult.diff.push(action.path)
                  targetResultData.old[action.path] = {
                    data: Buffer.from(action.old.data),
                    width: action.old.width,
                    height: action.old.height,
                  }
                  targetResultData.new[action.path] = {
                    data: Buffer.from(action.new.data),
                    width: action.new.width,
                    height: action.new.height,
                  }

                  hasBeenChanged = true

                  break
                }
                case 'NEW': {
                  targetResult.new.push(action.path)
                  targetResultData.new[action.path] = {
                    data: Buffer.from(action.data),
                    width: action.width,
                    height: action.height,
                  }

                  hasBeenChanged = true

                  break
                }
              }

              res.writeHead(200)
              res.end()
            })
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
