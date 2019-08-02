import path from 'path'
import http from 'http'
import url from 'url'
import makeDir from 'make-dir'
import { TarFs } from '@x-ray/tar-fs'
import { isString } from 'tsfn'
import pAll from 'p-all'
import { TResult } from '@x-ray/common-utils'
import { TResultData } from './types'

const SAVE_FILES_CONCURRENCY = 4

export type TRunServer = {
  platform: string,
  result: TResult,
  resultData: TResultData,
}

export const runServer = ({ platform, result, resultData }: TRunServer) => new Promise((resolve, reject) => {
  const server = http
    .createServer(async (req, res) => {
      try {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')

        if (req.method === 'GET') {
          if (req.url === '/list') {
            res.end(JSON.stringify({
              kind: 'text',
              files: result,
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

            // console.log(items[type][item])

            res.end(items[type][item].toString())
          }
        }

        if (req.method === 'POST') {
          if (req.url === '/save') {
            await pAll(
              Object.keys(result).map((file) => async () => {
                const screenshotsDir = path.join(path.dirname(file), '__x-ray__')
                const tarPath = path.join(screenshotsDir, `${platform}-snapshots.tar`)

                await makeDir(screenshotsDir)

                const tar = await TarFs(tarPath)

                result[file].new.forEach((item) => {
                  tar.write(item, resultData[file].new[item])
                })

                result[file].diff.forEach((item) => {
                  tar.write(item, resultData[file].new[item])
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