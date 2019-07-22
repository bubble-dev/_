import path from 'path'
import { cpus } from 'os'
import http from 'http'
import url from 'url'
import request from 'request-promise-native'
import { parent } from '@x-ray/common-utils'
import { run } from '@rebox/web'
import { TItemResult } from '@x-ray/screenshot-utils'
import makeDir from 'make-dir'
import { TarFs } from '@x-ray/tar-fs'
import { isString } from 'tsfn'
import pAll from 'p-all'
import { TOptions } from './types'

const SAVE_FILES_CONCURRENCY = 4
const DEBUGGER_ENDPOINT_HOST = 'localhost'
const DEBUGGER_ENDPOINT_PORT = 9222
const CONCURRENCY = Math.max(cpus().length - 1, 1)
const defaultOptions: Partial<TOptions> = {
  dpr: 2,
  width: 1024,
  height: 1024,
}
const childFile = require.resolve('./child')

type TFileResultType = 'ok' | 'diff' | 'new' | 'deleted'

type TFileResult = {
  [key in TFileResultType]: string[]
}

type TFileResultDataType = 'old' | 'new'

type TFileResultData = {
  old: {
    [key: string]: {
      width: number,
      height: number,
      data: Buffer,
    },
  },
  new: {
    [key: string]: {
      width: number,
      height: number,
      data: Buffer,
    },
  },
}

export type TResult = { [key: string]: TFileResult }
export type TResultData = { [key: string]: TFileResultData }

export const runFiles = async (targetFiles: string[], userOptions: TOptions) => {
  const { body: { webSocketDebuggerUrl } } = await request({
    uri: `http://${DEBUGGER_ENDPOINT_HOST}:${DEBUGGER_ENDPOINT_PORT}/json/version`,
    json: true,
    resolveWithFullResponse: true,
  })
  const options = {
    ...defaultOptions,
    ...userOptions,
    webSocketDebuggerUrl,
  }
  const result: TResult = {}
  const resultData: TResultData = {}

  await new Promise((resolve, reject) => {
    const workersCount = Math.min(targetFiles.length, CONCURRENCY)
    let targetFileIndex = 0
    let doneWorkersCount = 0

    const workers = Array(workersCount)
      .fill(null)
      .map(() => {
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
        const worker = parent(childFile, options)

        worker.on('message', async (action: TItemResult) => {
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

              break
            }
            case 'NEW': {
              targetResult.new.push(action.path)
              targetResultData.new[action.path] = {
                data: Buffer.from(action.data),
                width: action.width,
                height: action.height,
              }

              break
            }
            case 'DELETED': {
              targetResult.deleted.push(action.path)
              targetResultData.old[action.path] = {
                data: Buffer.from(action.data),
                width: action.width,
                height: action.height,
              }

              break
            }
            case 'BAILOUT': {
              await Promise.all(workers.map((worker) => worker.terminate()))

              reject('BAILOUT')

              break
            }
            case 'DONE': {
              const relativePath = path.relative(process.cwd(), action.path)
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

              if (targetFileIndex < targetFiles.length) {
                worker.postMessage({
                  type: 'FILE',
                  path: targetFiles[targetFileIndex++],
                })

                break
              }

              worker.postMessage({ type: 'DONE' })

              doneWorkersCount++

              if (doneWorkersCount === workers.length) {
                resolve()
              }

              break
            }
            case 'ERROR': {
              reject(action.data)
            }
          }
        })

        worker.postMessage({
          type: 'FILE',
          path: targetFiles[targetFileIndex++],
        })

        return worker
      })
  })

  await Promise.all([
    new Promise((resolve, reject) => {
      http
        .createServer(async (req, res) => {
          res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')

          if (req.method === 'GET') {
            if (req.url === '/list') {
              res.end(JSON.stringify(result))

              return
            }

            const urlData = url.parse(req.url!, true)

            if (urlData.pathname === '/get') {
              const { file, item, type } = urlData.query as {
                file: string,
                item: string,
                type: TFileResultDataType,
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

              res.setHeader('Access-Control-Expose-Headers', 'x-ray-width, x-ray-height')
              res.setHeader('x-ray-width', String(items[type][item].width))
              res.setHeader('x-ray-height', String(items[type][item].height))
              res.end(items[type][item].data, 'binary')
            }
          }

          if (req.method === 'POST') {
            if (req.url === '/save') {
              await pAll(
                Object.keys(result).map((file) => async () => {
                  const screenshotsDir = path.join(path.dirname(file), '__x-ray__')
                  const tarPath = path.join(screenshotsDir, 'chrome-screenshots.tar')

                  await makeDir(screenshotsDir)

                  const tar = await TarFs(tarPath)

                  result[file].new.forEach((item) => {
                    tar.write(item, resultData[file].new[item].data)
                  })

                  result[file].diff.forEach((item) => {
                    tar.write(item, resultData[file].new[item].data)
                  })

                  await tar.save()
                }),
                { concurrency: SAVE_FILES_CONCURRENCY }
              )

              res.end()
            }
          }
        })
        .on('error', reject)
        .listen(3001, 'localhost')
    }),

    run({
      htmlTemplatePath: 'packages/x-ray/ui/src/index.html',
      entryPointPath: 'packages/x-ray/ui/src/index.tsx',
      isQuiet: true,
    }),
  ])
}
