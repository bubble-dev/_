import { cpus } from 'os'
import http from 'http'
import url from 'url'
import request from 'request-promise-native'
import { parent } from '@x-ray/common-utils'
import { run } from '@rebox/web'
import { TItemResult } from '@x-ray/screenshot-utils'
import { TOptions } from './types'

const DEBUGGER_ENDPOINT_HOST = 'localhost'
const DEBUGGER_ENDPOINT_PORT = 9222
const CONCURRENCY = Math.max(cpus().length - 1, 1)
const defaultOptions: Partial<TOptions> = {
  dpr: 2,
  width: 1024,
  height: 1024,
}
const childFile = require.resolve('./child')

type TFileResult = {
  ok: string[],
  diff: string[],
  new: string[],
}

type TFileResultData = {
  diff: {
    [key: string]: {
      old: {
        width: number,
        height: number,
        data: Buffer,
      },
      new: {
        width: number,
        height: number,
        data: Buffer,
      },
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

type TResult = { [key: string]: TFileResult }
type TResultData = { [key: string]: TFileResultData }

const runFiles = async (targetFiles: string[], userOptions: TOptions) => {
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
        }
        let targetResultData: TFileResultData = {
          diff: {},
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
              targetResultData.diff[action.path] = {
                old: {
                  width: action.old.width,
                  height: action.old.height,
                  data: Buffer.from(action.old.data),
                },
                new: {
                  width: action.new.width,
                  height: action.new.height,
                  data: Buffer.from(action.new.data),
                },
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
            case 'BAILOUT': {
              await Promise.all(workers.map((worker) => worker.terminate()))

              reject('BAILOUT')

              break
            }
            case 'DONE': {
              result[action.path] = targetResult
              resultData[action.path] = targetResultData

              targetResult = {
                ok: [],
                diff: [],
                new: [],
              }
              targetResultData = {
                diff: {},
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
        .createServer((req, res) => {
          if (req.method === 'GET') {
            if (req.url === '/list') {
              res.end(JSON.stringify(result))

              return
            }

            const urlData = url.parse(req.url!, true)

            if (urlData.pathname === '/get') {
              const { file, item, type } = urlData.query

              if (Array.isArray(file)) {
                throw new Error('There should be only one ?file param')
              }

              if (Array.isArray(item)) {
                throw new Error('There should be only one ?item param')
              }

              if (Array.isArray(type)) {
                throw new Error('There should be only one ?type param')
              }

              // if (!result.has(file)) {
              //   throw new Error(`There is no such file "${file}"`)
              // }

              const items = resultData[file]

              // if (!items[type].has(item)) {
              //   throw new Error(`Cannot find "${file}" "${item}" "${type}"`)
              // }

              // console.log(items[type].get(item).buffer)

              res.setHeader('Access-Control-Allow-Origin', '*')
              res.setHeader('Access-Control-Expose-Headers', 'x-ray-width, x-ray-height')
              res.setHeader('x-ray-width', String(items.new[item].width))
              res.setHeader('x-ray-height', String(items.new[item].height))
              res.end(items.new[item].data, 'binary')
            }
          }
        })
        .on('error', reject)
        .listen(3001, 'localhost')
    }),

    run({
      htmlTemplatePath: 'packages/x-ray/ui/src/index.html',
      entryPointPath: 'packages/x-ray/ui/src/index.tsx',
    }),
  ])

  // console.log(result.entries())
}

export default runFiles
