import { Worker } from 'worker_threads'

const setupFile = require.resolve('./setup')

export default (childFile: string, options: {[k: string]: any}): Worker =>
  new Worker(setupFile, {
    workerData: {
      childFile,
      options,
    },
  })
