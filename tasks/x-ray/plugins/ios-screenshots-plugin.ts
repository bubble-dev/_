import plugin, { StartFilesProps } from '@start/plugin'

export default (appPath: string) =>
  plugin<StartFilesProps, void>('x-ray-ios-screenshots', ({ logMessage }) => async ({ files }) => {
    if (files.length === 0) {
      return logMessage('no files, skipping')
    }

    const { createServer } = await import('http')
    const { createReadStream } = await import('fs')
    const { rnResolve } = await import('rn-resolve')
    const { buildJsBundle, runSimulator, installApp, launchApp } = await import('@rebox/ios')
    const { runServer, prepareFiles } = await import('@x-ray/native-screenshots')

    const entryPointPath = await rnResolve('@x-ray/native-screenshots-app')

    await prepareFiles(entryPointPath, files.map((file) => file.path))

    const bundlePath = await buildJsBundle({
      entryPointPath,
      outputPath: appPath,
    })

    logMessage('x-ray bundle is ready')

    const httpServer = createServer((req, res) => {
      if (req.method === 'GET') {
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

    let killSimulator = null

    try {
      killSimulator = await runSimulator({
        iOSVersion: '12.2',
        iPhoneVersion: 7,
        isHeadless: false,
      })

      logMessage('device is ready')

      await installApp({ appPath })

      logMessage('app is installed')

      const runScreenshots = await runServer({ platform: 'ios' })

      await launchApp({ appId: 'org.bubble-dev.xray' })

      logMessage('app is launched')

      await runScreenshots()
    } finally {
      if (killSimulator !== null) {
        killSimulator()
      }

      httpServer.close()
    }
  })
