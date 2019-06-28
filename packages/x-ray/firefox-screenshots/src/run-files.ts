import { logTotalResults, parent } from '@x-ray/common-utils'
import { TOptions } from './types'

const defaultOptions: Partial<TOptions> = {
  width: 1024,
  height: 1024,
}
const childFile = require.resolve('./child')

const runFiles = async (targetFiles: string[], userOptions: TOptions) => {
  const options = {
    ...defaultOptions,
    ...userOptions,
  }
  const totalResults = await parent(childFile, targetFiles, options)

  logTotalResults([totalResults])
}

export default runFiles
