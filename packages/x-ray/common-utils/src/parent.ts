/* eslint-disable no-throw-literal */
import execa from 'execa'
import { TTotalResult } from './types'
import makeLogger from './make-logger'

const setupFile = require.resolve('./setup')

const parent = async (childFile: string, targetFiles: string[], options: {[k: string]: any}): Promise<TTotalResult> => {
  const childProcess = execa('node', [setupFile, JSON.stringify(options), childFile, ...targetFiles], {
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
