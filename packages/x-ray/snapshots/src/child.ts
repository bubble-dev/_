/* eslint-disable no-throw-literal */
import { promisify } from 'util'
import path from 'path'
import pAll from 'p-all'
import fs from 'graceful-fs'
import makeDir from 'make-dir'
import { TMessage } from '@x-ray/common-utils'
import { TarFs } from '@x-ray/tar-fs'
import serialize from '@x-ray/serialize-react-tree'
import checkSnapshot from './check'
import { TMeta } from './types'

const pathExists = promisify(fs.access)

// @ts-ignore
const processSend: (message: TMessage) => Promise<void> = promisify(process.send.bind(process))
const shouldBailout = Boolean(process.env.XRAY_CI)
const CONCURRENCY = 4

export default async (targetFiles: string[], options: {[k: string]: any}) => {
  const { platform } = options

  try {
    for (const targetPath of targetFiles) {
      const { default: items } = await import(targetPath) as { default: TMeta[] }
      const snapshotsDir = path.join(path.dirname(targetPath), '__x-ray__')

      if (!shouldBailout) {
        try {
          await pathExists(snapshotsDir)
        } catch (e) {
          await makeDir(snapshotsDir)
        }
      }

      const tar = await TarFs(path.join(snapshotsDir, `${platform}-snapshots.tar`))

      await pAll(
        items.map((item) => async () => {
          const snapshot = await serialize(item.element)
          const snapshotName = `${item.options.name}.txt`
          const message = checkSnapshot(snapshot, tar, snapshotName, shouldBailout)

          await processSend(message)

          if (shouldBailout) {
            if (message.status === 'diff' || message.status === 'unknown') {
              throw null
            }
          }
        }),
        { concurrency: CONCURRENCY }
      )

      await tar.save()
    }

    process.disconnect()
    process.exit(0) // eslint-disable-line
  } catch (err) {
    if (err !== null) {
      console.error(err)
    }

    process.disconnect()
    process.exit(1) // eslint-disable-line
  }
}
