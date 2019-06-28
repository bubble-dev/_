/* eslint-disable no-throw-literal */
import execa from 'execa'
import { makeLogger, TTotalResult } from '@x-ray/common-utils'
import { TOptions } from './types'

const childFile = require.resolve('./child')

const parent = async (targetFiles: string[], options: TOptions): Promise<TTotalResult> => {
  const childProcess = execa('node', ['--require', options.setupFile, childFile, ...targetFiles], {
    stdio: ['ignore', process.stdout, process.stderr, 'ipc'],
    stripEof: true,
    env: {
      FORCE_COLOR: '1',
    },
  })
  const logger = makeLogger()

  childProcess.on('message', logger.log)

  try {
    await childProcess

    return logger.totalResult()
  } catch (error) {
    throw null
  }
}

export default parent
