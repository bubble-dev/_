/* eslint-disable no-throw-literal */
import { promisify } from 'util'
import path from 'path'
import pAll from 'p-all'
import fs from 'graceful-fs'
import makeDir from 'make-dir'
import { TMessage } from '@x-ray/common-utils'
import { checkSnapshot, TMeta } from '@x-ray/snapshot-utils'
import { TarFs } from '@x-ray/next'
import getSnapshot from './get'

const targetFiles = process.argv.slice(2)
const pathExists = promisify(fs.access)

// @ts-ignore
const processSend: (message: TMessage) => Promise<void> = promisify(process.send.bind(process))
const shouldBailout = Boolean(process.env.XRAY_CI)
const CONCURRENCY = 4

;(async () => {
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

      const tar = await TarFs(path.join(snapshotsDir, 'web-snapshots.tar'))

      await pAll(
        items.map((item) => async () => {
          const snapshot = await getSnapshot(item.element)
          const snapshotName = `${item.options.name}.js`
          const message = await checkSnapshot(snapshot, tar, snapshotName, shouldBailout)

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
})()
