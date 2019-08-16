import path from 'path'
import { TOptions } from '@x-ray/common-utils'
import { makeWorker } from '@x-ray/worker-utils'
import { diffArrays } from 'diff'
import { TRunSnapshotsResult, TSnapshotsResultData, TSnapshotsFileResultData, TSnapshotsItemResult, TSnapshotsResult, TSnapshotsFileResult, TFileResultLine } from './types'

const getDataSize = (lines: TFileResultLine[]) => {
  let maxWidth = 0

  for (const line of lines) {
    if (line.value.length > maxWidth) {
      maxWidth = line.value.length
    }
  }

  return {
    width: maxWidth,
    height: lines.length,
  }
}

export const runSnapshots = (childFile: string, targetFiles: string[], consurrency: number, options: TOptions) => new Promise<TRunSnapshotsResult>((resolve, reject) => {
  const workersCount = Math.min(targetFiles.length, consurrency)
  let targetFileIndex = 0
  let doneWorkersCount = 0

  const result: TSnapshotsResult = {}
  const resultData: TSnapshotsResultData = {}
  let hasBeenChanged = false

  const workers = Array(workersCount)
    .fill(null)
    .map(() => {
      let targetResult: TSnapshotsFileResult = {
        deleted: {},
        new: {},
        diff: {},
      }
      let targetResultData: TSnapshotsFileResultData = {
        deleted: {},
        new: {},
        diff: {},
      }
      const worker = makeWorker(childFile, options)

      worker.on('message', async (action: TSnapshotsItemResult) => {
        switch (action.type) {
          case 'OK': {
            break
          }
          case 'DIFF': {
            const oldData = Buffer.from(action.oldData)
              .toString()
              .split('\n')
            const newData = Buffer.from(action.newData)
              .toString()
              .split('\n')

            const diffData = diffArrays(oldData, newData)

            const data = diffData.reduce((result, chunk) => {
              return result.concat(
                chunk.value.map((line) => {
                  if (chunk.added) {
                    return {
                      value: line,
                      type: 'added',
                    }
                  }

                  if (chunk.removed) {
                    return {
                      value: line,
                      type: 'removed',
                    }
                  }

                  return {
                    value: line,
                  }
                })
              )
            }, [] as TFileResultLine[])

            targetResult.diff[action.id] = {
              serializedElement: action.serializedElement,
              ...getDataSize(data),
            }

            hasBeenChanged = true

            break
          }
          case 'NEW': {
            const data: TFileResultLine[] = Buffer.from(action.data)
              .toString()
              .split('\n')
              .map((line) => ({
                value: line,
              }))

            targetResult.new[action.id] = {
              serializedElement: action.serializedElement,
              ...getDataSize(data),
            }
            targetResultData.new[action.id] = data

            hasBeenChanged = true

            break
          }
          case 'DELETED': {
            const data = Buffer.from(action.data)
              .toString()
              .split('\n')
              .map((line) => ({
                value: line,
              }))

            targetResult.deleted[action.id] = {
              serializedElement: action.serializedElement,
              ...getDataSize(data),
            }
            targetResultData.deleted[action.id] = data

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
              deleted: {},
              new: {},
              diff: {},
            }
            targetResultData = {
              deleted: {},
              new: {},
              diff: {},
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
