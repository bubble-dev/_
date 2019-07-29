import path from 'path'
import { parent, TOptions, TResult, TFileResult } from '@x-ray/common-utils'
import { TRunSnapshotsResult, TResultData, TFileResultData, TItemResult } from './types'

export const runSnapshots = (childFile: string, targetFiles: string[], consurrency: number, options: TOptions) => new Promise<TRunSnapshotsResult>((resolve, reject) => {
  const workersCount = Math.min(targetFiles.length, consurrency)
  let targetFileIndex = 0
  let doneWorkersCount = 0

  const result: TResult = {}
  const resultData: TResultData = {}
  let hasBeenChanged = false

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
            targetResultData.old[action.path] = Buffer.from(action.oldData)
            targetResultData.new[action.path] = Buffer.from(action.newData)

            hasBeenChanged = true

            break
          }
          case 'NEW': {
            targetResult.new.push(action.path)
            targetResultData.new[action.path] = Buffer.from(action.data)

            hasBeenChanged = true

            break
          }
          case 'DELETED': {
            targetResult.deleted.push(action.path)
            targetResultData.old[action.path] = Buffer.from(action.data)

            hasBeenChanged = true

            break
          }
          case 'BAILOUT': {
            await Promise.all(workers.map((worker) => worker.terminate()))

            reject(null)

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
              resolve({
                result,
                resultData,
                hasBeenChanged,
              })
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
