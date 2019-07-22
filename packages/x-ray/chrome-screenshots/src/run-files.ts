import path from 'path'
import { cpus } from 'os'
import request from 'request-promise-native'
import { parent } from '@x-ray/common-utils'
import { run } from '@rebox/web'
import { TItemResult } from '@x-ray/screenshot-utils'
import { runServer } from './server'
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

type TFileResultType = 'ok' | 'diff' | 'new' | 'deleted'

type TFileResult = {
  [key in TFileResultType]: string[]
}

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
  let hasBeenChanged = false

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
            case 'DELETED': {
              targetResult.deleted.push(action.path)
              targetResultData.old[action.path] = {
                data: Buffer.from(action.data),
                width: action.width,
                height: action.height,
              }

              hasBeenChanged = true

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

  if (hasBeenChanged) {
    const closeReboxServer = await run({
      htmlTemplatePath: 'packages/x-ray/ui/src/index.html',
      entryPointPath: 'packages/x-ray/ui/src/index.tsx',
      isQuiet: true,
    })

    await runServer(result, resultData)
    await closeReboxServer()
  }
}
