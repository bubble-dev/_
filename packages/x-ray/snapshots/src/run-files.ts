import { cpus } from 'os'
import { divideFiles, logTotalResults, TOptions, parent } from '@x-ray/common-utils'

const CONCURRENCY = Math.max(cpus().length - 1, 1)
const childFilePath = require.resolve('./child')

const runFiles = async (targetFiles: string[], options: TOptions) => {
  const totalResults = await Promise.all(
    divideFiles(targetFiles, CONCURRENCY).map((files) => parent(childFilePath, files, options))
  )

  logTotalResults(totalResults)
}

export default runFiles
