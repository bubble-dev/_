/* eslint-disable no-throw-literal */
import path from 'path'
import { parentPort, MessagePort } from 'worker_threads'
import pAll from 'p-all'
import { TarFs } from '@x-ray/tar-fs'
import serialize from '@x-ray/serialize-react-tree'
import { TCheckRequest, TOptions } from '@x-ray/common-utils'
import { map } from 'iterama'
import { checkSnapshot } from './check-snapshot'
import { TMeta } from './types'

const shouldBailout = Boolean(process.env.XRAY_CI)
const port = parentPort as any as MessagePort
const CONCURRENCY = 4

export default async (options: TOptions) => {
  try {
    const { platform } = options
    const filenames: string[] = []

    await new Promise((resolve, reject) => {
      port.on('message', async (action: TCheckRequest) => {
        try {
          switch (action.type) {
            case 'FILE': {
              const { default: items } = await import(action.path) as { default: Iterable<TMeta> }
              const snapshotsDir = path.join(path.dirname(action.path), '__x-ray__')
              const tar = await TarFs(path.join(snapshotsDir, `${platform}-snapshots.tar`))

              await pAll(
                map((item: TMeta) => async () => {
                  const snapshot = await serialize(item.element)
                  const message = await checkSnapshot(Buffer.from(snapshot), tar, item.id)

                  if (shouldBailout) {
                    switch (message.type) {
                      case 'DIFF':
                      case 'NEW': {
                        port.postMessage({
                          type: 'BAILOUT',
                          path: message.path,
                        })

                        port.close()

                        throw null
                      }
                    }
                  }

                  switch (message.type) {
                    case 'OK':
                    case 'DIFF':
                    case 'NEW': {
                      port.postMessage(message)

                      break
                    }
                  }
                })(items),
                { concurrency: CONCURRENCY }
              )

              for (const item of tar.list()) {
                if (!filenames.includes(item)) {
                  const data = await tar.read(item) as Buffer

                  port.postMessage({
                    type: 'DELETED',
                    path: item,
                    data,
                  })
                }
              }

              port.postMessage({
                type: 'DONE',
                path: action.path,
              })

              break
            }
            case 'DONE': {
              port.close()
              resolve()
            }
          }
        } catch (err) {
          reject(err)
        }
      })
    })
  } catch (err) {
    console.error(err)

    if (err !== null) {
      port.postMessage({
        type: 'ERROR',
        data: err.message,
      })
    }
  }
}
