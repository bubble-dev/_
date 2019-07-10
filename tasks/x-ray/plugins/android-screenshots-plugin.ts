import plugin, { StartFilesProps } from '@start/plugin'

export default (appPath: string) =>
  plugin<StartFilesProps, void>('x-ray-android-screenshots', ({ logMessage }) => async ({ files }) => {
    const path = await import('path')
    const { createServer } = await import('http')
    const { createReadStream } = await import('fs')
    const { default: execa } = await import('execa')
    const { rnResolve } = await import('rn-resolve')
    const { buildJsBundle, runEmulator } = await import('@rebox/android')
    const { runServer, prepareFiles } = await import('@x-ray/native-screenshots')

    const entryPointPath = await rnResolve('@x-ray/native-screenshots-app')

    await prepareFiles(entryPointPath, files.map((file) => file.path))

    const bundlePath = await buildJsBundle({
      entryPointPath,
      outputPath: path.dirname(appPath),
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

        const fileStream = createReadStream(bundlePath)

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

    let killEmulator = null

    try {
      killEmulator = await runEmulator({
        isHeadless: false,
        portsToForward: [3002, 8081],
      })

      logMessage('device is ready')

      const runScreenshots = await runServer({ platform: 'android' })

      await execa('adb', ['install', '-r', appPath], {
        stderr: process.stderr,
      })

      logMessage('x-ray app is installed')

      await execa('adb', ['shell', 'am', 'start', '-n', 'org.bubble_dev.xray/com.rebox.MainActivity'], {
        stderr: process.stderr,
      })

      logMessage('x-ray app is launching')

      await runScreenshots()
    } finally {
      if (killEmulator !== null) {
        killEmulator()
      }

      httpServer.close()
    }
  })
