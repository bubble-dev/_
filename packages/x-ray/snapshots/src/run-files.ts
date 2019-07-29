import { cpus } from 'os'
import { TOptions } from '@x-ray/common-utils'
import { run } from '@rebox/web'
import { runSnapshots } from './run-snapshots'
import { runServer } from './run-server'

const CONCURRENCY = Math.max(cpus().length - 1, 1)
const childFile = require.resolve('./child')

export const runFiles = async (targetFiles: string[], options: TOptions) => {
  console.time('snapshots')
  const { result, resultData, hasBeenChanged } = await runSnapshots(childFile, targetFiles, CONCURRENCY, options)
  console.timeEnd('snapshots')

  if (hasBeenChanged) {
    const closeReboxServer = await run({
      htmlTemplatePath: 'packages/x-ray/ui/src/index.html',
      entryPointPath: 'packages/x-ray/ui/src/index.tsx',
      isQuiet: true,
    })

    await runServer({
      platform: options.platform,
      result,
      resultData,
    })
    await closeReboxServer()
  }
}
