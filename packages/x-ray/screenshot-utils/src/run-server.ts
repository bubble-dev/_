import path from 'path'
import http from 'http'
import url from 'url'
import makeDir from 'make-dir'
import { TarFs } from '@x-ray/tar-fs'
import { isString, isUndefined } from 'tsfn'
import pAll from 'p-all'
import { TResult } from '@x-ray/common-utils'
import pkgDir from 'pkg-dir'
import { TResultData } from './types'

const SAVE_FILES_CONCURRENCY = 4

export type TRunServer = {
  platform: string,
  dpr: number,
  result: TResult,
  resultData: TResultData,
}

export const runServer = ({ platform, dpr, result, resultData }: TRunServer) => new Promise((resolve, reject) => {
  const pathMap = new Map<string, string>()

  const server = http
    .createServer(async (req, res) => {
      try {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')

        if (req.method === 'GET') {
          if (req.url === '/list') {
            res.end(JSON.stringify({
              kind: 'image',
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
              }, Promise.resolve({} as TResult)),
            }))

            return
          }

          const urlData = url.parse(req.url!, true)

          if (urlData.pathname === '/get') {
            const { file, item, type } = urlData.query as {
              file: string,
              item: string,
              type: 'old' | 'new',
            }

            if (!isString(file)) {
              throw new Error(`?file param is required in ${req.url}`)
            }

            if (!isString(item)) {
              throw new Error(`?item param is required in ${req.url}`)
            }

            if (!isString(type)) {
              throw new Error(`?type param is required in ${req.url}`)
            }

            if (!Reflect.has(resultData, file)) {
              throw new Error(`There is no such file "${file}"`)
            }

            const items = resultData[file]

            if (!Reflect.has(items, type)) {
              throw new Error(`Cannot find "${file}" → "${type}"`)
            }

            if (!Reflect.has(items[type], item)) {
              throw new Error(`Cannot find "${file}" → "${type}" → "${item}"`)
            }

            res.setHeader('Access-Control-Expose-Headers', 'x-ray-width, x-ray-height, x-ray-dpr')
            res.setHeader('x-ray-width', String(items[type][item].width))
            res.setHeader('x-ray-height', String(items[type][item].height))
            res.setHeader('x-ray-dpr', String(dpr))
            res.end(items[type][item].data, 'binary')
          }
        }

        if (req.method === 'POST') {
          if (req.url === '/save') {
            const data = await new Promise<TResult>((resolve, reject) => {
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

                result[file].new.forEach((item) => {
                  tar.write(item, resultData[file].new[item].data)
                })

                result[file].diff.forEach((item) => {
                  tar.write(item, resultData[file].new[item].data)
                })

                result[file].deleted.forEach((item) => {
                  tar.delete(item)
                })

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
