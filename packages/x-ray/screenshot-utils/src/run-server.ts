import path from 'path'
import http from 'http'
import url from 'url'
import makeDir from 'make-dir'
import { TarFs } from '@x-ray/tar-fs'
import { isString, isUndefined, objectHas } from 'tsfn'
import pAll from 'p-all'
import pkgDir from 'pkg-dir'
import { TScreenshotsResultData, TScreenshotsResult, TScreenshotResultType, TScreenshotsSave } from './types'

const SAVE_FILES_CONCURRENCY = 4

export type TRunServer = {
  platform: string,
  result: TScreenshotsResult,
  resultData: TScreenshotsResultData,
}

export const runServer = ({ platform, result, resultData }: TRunServer) => new Promise((resolve, reject) => {
  const pathMap = new Map<string, string>()

  const server = http
    .createServer(async (req, res) => {
      try {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')

        if (req.method === 'GET') {
          if (req.url === '/list') {
            res.end(JSON.stringify({
              type: 'image',
              files: await Object.keys(result).reduce(async (accPromise, longPath) => {
                const acc = await accPromise

                const packageDir = await pkgDir(path.dirname(longPath))

                if (isUndefined(packageDir)) {
                  throw new Error(`Cannot find package dir for "${longPath}"`)
                }

                const shortPath = path.relative(path.resolve('packages/'), packageDir)

                pathMap.set(shortPath, longPath)
                pathMap.set(longPath, shortPath)

                acc[shortPath] = result[longPath]

                return acc
              }, Promise.resolve({} as TScreenshotsResult)),
            }))

            return
          }

          const urlData = url.parse(req.url!, true)

          if (urlData.pathname === '/get') {
            const { file: shortPath, id, type } = urlData.query as {
              file: string,
              id: string,
              type: TScreenshotResultType,
            }

            if (!isString(shortPath)) {
              throw new Error(`?file param is required in ${req.url}`)
            }

            if (!isString(id)) {
              throw new Error(`?id param is required in ${req.url}`)
            }

            if (!isString(type)) {
              throw new Error(`?type param is required in ${req.url}`)
            }

            const file = pathMap.get(shortPath)

            if (isUndefined(file)) {
              throw new Error(`Cannot resolve "${shortPath}"`)
            }

            if (!Reflect.has(resultData, file)) {
              throw new Error(`There is no such file "${file}"`)
            }

            const items = resultData[file]

            if (!Reflect.has(items, type)) {
              throw new Error(`Cannot find "${file}" → "${type}"`)
            }

            if (!Reflect.has(items[type], id)) {
              throw new Error(`Cannot find "${file}" → "${type}" → "${id}"`)
            }

            res.setHeader('Content-Type', 'image/png')
            res.end(items[type][id], 'binary')
          }
        }

        if (req.method === 'POST') {
          if (req.url === '/save') {
            const data = await new Promise<TScreenshotsSave>((resolve, reject) => {
              let body = ''

              req
                .on('data', (chunk) => {
                  body += chunk.toString()
                })
                .on('error', reject)
                .on('end', () => {
                  resolve(JSON.parse(body))
                })
            })

            console.log('SAVE', data)

            await pAll(
              Object.keys(data).map((shortPath) => async () => {
                const file = pathMap.get(shortPath)

                if (isUndefined(file)) {
                  throw new Error(`Cannot resolve "${shortPath}"`)
                }

                const screenshotsDir = path.join(path.dirname(file), '__x-ray__')
                const tarPath = path.join(screenshotsDir, `${platform}-screenshots.tar`)

                await makeDir(screenshotsDir)

                const tar = await TarFs(tarPath)
                const fileResult = data[shortPath]

                if (objectHas(fileResult, 'old')) {
                  fileResult.old.forEach((item) => {
                    tar.delete(item)
                  })
                }

                if (objectHas(fileResult, 'new')) {
                  fileResult.new.forEach((id) => {
                    tar.write(id, {
                      meta: result[file].new[id].serializedElement,
                      data: resultData[file].new[id],
                    })
                  })
                }

                await tar.save()
              }),
              { concurrency: SAVE_FILES_CONCURRENCY }
            )

            res.end()
            server.close(resolve)
          }
        }
      } catch (e) {
        reject(e)
      }
    })
    .on('error', reject)
    .listen(3001, 'localhost')
})
