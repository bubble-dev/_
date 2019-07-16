import { cpus } from 'os'
import request from 'request-promise-native'
import { parent, TItemResult } from '@x-ray/common-utils'
import { TOptions } from './types'

const DEBUGGER_ENDPOINT_HOST = 'localhost'
const DEBUGGER_ENDPOINT_PORT = 9222
const CONCURRENCY = Math.max(cpus().length - 1, 1)
const defaultOptions: Partial<TOptions> = {
  dpr: 1,
  width: 1024,
  height: 1024,
}
const childFile = require.resolve('./child')

type TFileResult = {
  ok: Set<string>,
  diff: Map<string, Buffer>,
  new: Map<string, Buffer>,
}

type TResult = Map<string, TFileResult>

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
  const result: TResult = new Map()

  await new Promise((resolve, reject) => {
    const workersCount = Math.min(targetFiles.length, CONCURRENCY)
    let targetFileIndex = 0
    let doneWorkersCount = 0

    const workers = Array(workersCount)
      .fill(null)
      .map(() => {
        let targetResult: TFileResult = {
          ok: new Set(),
          diff: new Map(),
          new: new Map(),
        }
        const worker = parent(childFile, options)

        worker.on('message', (action: TItemResult) => {
          console.log(action)

          switch (action.type) {
            case 'OK': {
              return targetResult.ok.add(action.path)
            }
            case 'DIFF': {
              return targetResult.diff.set(action.path, action.data!)
            }
            case 'NEW': {
              return targetResult.new.set(action.path, action.data!)
            }
            case 'DONE': {
              result.set(action.path, targetResult)

              targetResult = {
                ok: new Set(),
                diff: new Map(),
                new: new Map(),
              }

              if (targetFileIndex < targetFiles.length) {
                return worker.postMessage({
                  type: 'FILE',
                  path: targetFiles[targetFileIndex++],
                })
              }

              worker.postMessage({ type: 'DONE' })

              doneWorkersCount++

              if (doneWorkersCount === workers.length) {
                resolve()
              }

              return
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

  console.log(result.entries())
}

export default runFiles
