/* eslint-disable import/named */
import { createServer } from 'http'
import { createReadStream } from 'fs'
import plugin, { StartFilesProps } from '@start/plugin'
import execa from 'execa'
import { rnResolve } from 'rn-resolve'

const BUNDLE_PATH = '.rebox/android/index.android.bundle'
const APP_PATH = '.rebox/build/X-Ray.apk'

export default plugin<StartFilesProps, void>('x-ray-android-screenshots', ({ logMessage }) => async ({ files }) => {
  const { runServer, prepareFiles } = await import('@x-ray/native-screenshots')
  const { buildJsBundle } = await import('@rebox/android')

  const entryPointPath = await rnResolve('@x-ray/native-screenshots-app')

  await prepareFiles(entryPointPath, files.map((file) => file.path))
  await buildJsBundle({
    entryPointPath,
    outputPath: BUNDLE_PATH,
  })

  logMessage('bundle is ready')

  const httpServer = createServer((req, res) => {
    if (req.method === 'GET') {
      if (req.url === '/status') {
        res.writeHead(200)

        return res.end('packager-status:running')
      }

      if (req.url === '/message') {
        res.writeHead(200)

        return res.end()
      }

      res.writeHead(200, { 'Content-Type': 'application/javascript' })

      const fileStream = createReadStream(BUNDLE_PATH)

      fileStream
        .on('error', (e) => {
          throw e
        })
        .pipe(res)
    }
  })
    .on('error', (e) => {
      throw e
    })
    .listen(8081, '127.0.0.1')

  let emulatorProcess = null

  try {
    emulatorProcess = execa('bash', [require.resolve('@rebox/android/android/run-android-emulator.sh')], {
      stderr: process.stderr,
      env: {
        FORCE_COLOR: '1',
      },
    })

    await emulatorProcess

    await execa(
      `${process.env.ANDROID_HOME}/platform-tools/adb`,
      [
        'reverse',
        'tcp:3001',
        'tcp:3001',
      ]
    )

    await execa(
      `${process.env.ANDROID_HOME}/platform-tools/adb`,
      [
        'reverse',
        'tcp:3002',
        'tcp:3002',
      ]
    )

    logMessage('device is ready')

    const runScreenshots = await runServer({ platform: 'android' })

    await execa('adb', ['install', '-r', APP_PATH], {
      stderr: process.stderr,
    })

    logMessage('x-ray app is installed')

    await execa('adb', ['shell', 'am', 'start', '-n', 'org.bubble_dev.xray/com.rebox.MainActivity'], {
      stderr: process.stderr,
    })

    logMessage('x-ray app is launching')

    await runScreenshots()
  } finally {
    if (emulatorProcess !== null) {
      emulatorProcess.kill()
    }

    httpServer.close()
  }
})
