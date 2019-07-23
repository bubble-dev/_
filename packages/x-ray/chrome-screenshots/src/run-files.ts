import { cpus } from 'os'
import request from 'request-promise-native'
import { run } from '@rebox/web'
import { runServer, runScreenshots } from '@x-ray/screenshot-utils'
import { TOptions, TUserOptions } from './types'

const CONCURRENCY = Math.max(cpus().length - 1, 1)
const DEBUGGER_ENDPOINT_HOST = 'localhost'
const DEBUGGER_ENDPOINT_PORT = 9222
const defaultOptions = {
  dpr: 2,
  width: 1024,
  height: 1024,
}
const childFile = require.resolve('./child')

export const runFiles = async (targetFiles: string[], userOptions: TUserOptions) => {
  const { body: { webSocketDebuggerUrl } } = await request({
    uri: `http://${DEBUGGER_ENDPOINT_HOST}:${DEBUGGER_ENDPOINT_PORT}/json/version`,
    json: true,
    resolveWithFullResponse: true,
  })
  const options: TOptions = {
    ...defaultOptions,
    ...userOptions,
    webSocketDebuggerUrl,
  }

  console.time('screenshots')
  const { result, resultData, hasBeenChanged } = await runScreenshots(childFile, targetFiles, CONCURRENCY, options)
  console.timeEnd('screenshots')

  if (hasBeenChanged) {
    const closeReboxServer = await run({
      htmlTemplatePath: 'packages/x-ray/ui/src/index.html',
      entryPointPath: 'packages/x-ray/ui/src/index.tsx',
      isQuiet: true,
    })

    await runServer({
      platform: options.platform,
      dpr: options.dpr,
      result,
      resultData,
    })
    await closeReboxServer()
  }
}
