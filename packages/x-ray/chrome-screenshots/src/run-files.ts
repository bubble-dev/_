import { cpus } from 'os'
import request from 'request-promise-native'
import { divideFiles, logTotalResults, parent } from '@x-ray/common-utils'
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

const runFiles = async (targetFiles: string[], userOptions: TOptions) => {
  const options = {
    ...defaultOptions,
    ...userOptions,
  }
  const { body: { webSocketDebuggerUrl } } = await request({
    uri: `http://${DEBUGGER_ENDPOINT_HOST}:${DEBUGGER_ENDPOINT_PORT}/json/version`,
    json: true,
    resolveWithFullResponse: true,
  })

  process.env.WEBSOCKET_DEBUGGER_URL = webSocketDebuggerUrl

  const totalResults = await Promise.all(
    divideFiles(targetFiles, CONCURRENCY).map((files) => parent(childFile, files, options))
  )

  logTotalResults(totalResults)
}

export default runFiles
