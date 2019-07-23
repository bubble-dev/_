import { Worker } from 'worker_threads' // eslint-disable-line
import { TAnyObject } from 'tsfn'

const setupFile = require.resolve('./setup')

export default (childFile: string, options: TAnyObject): Worker =>
  new Worker(setupFile, {
    workerData: {
      childFile,
      options,
    },
  })
