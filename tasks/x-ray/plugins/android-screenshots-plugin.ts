/* eslint-disable import/named */
import { createServer } from 'http'
import { createReadStream } from 'fs'
import plugin, { StartFilesProps } from '@start/plugin'
import execa from 'execa'

const BUNDLE_PATH = '.rebox/android/index.android.bundle'
const APP_PATH = '.rebox/android/X-Ray.apk'

export default plugin<StartFilesProps, void>('x-ray-android-screenshots', ({ logMessage }) => async ({ files }) => {
  const { runServer, prepareFiles } = await import('@x-ray/native-screenshots')
  const { buildJsBundle } = await import('@rebox/android')

  await prepareFiles(files.map((file) => file.path))
  await buildJsBundle({
    entryPointPath: '@x-ray/native-screenshots/build/native/App',
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
    // https://developer.android.com/studio/run/emulator-commandline.html
    // https://github.com/voidxv/avd_creation_script
    emulatorProcess = execa(
      `${process.env.ANDROID_HOME}/emulator/emulator`,
      [
        '-avd',
        'xray',
        '-gpu',
        'host',
        '-no-window',
        '-no-audio',
        '-memory',
        '2048',
        '-netfast',
        '-accel',
        'on',
        '-no-boot-anim',
        '-no-snapshot',
      ],
      {
        stderr: process.stderr,
      }
    )

    // https://stackoverflow.com/questions/41151883/wait-for-android-emulator-to-be-running-before-next-shell-command
    await execa(
      `${process.env.ANDROID_HOME}/platform-tools/adb`,
      [
        'wait-for-device',
        'shell',
        'while [[ -z $(getprop sys.boot_completed) ]]; do sleep 1; done;',
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

    await execa(
      `${process.env.ANDROID_HOME}/platform-tools/adb`,
      [
        'reverse',
        'tcp:8081',
        'tcp:8081',
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
