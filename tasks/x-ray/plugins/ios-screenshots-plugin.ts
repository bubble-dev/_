import plugin, { StartFilesProps } from '@start/plugin'

export default (appPath: string) =>
  plugin<StartFilesProps, void>('x-ray-ios-screenshots', ({ logMessage }) => async ({ files }) => {
    if (files.length === 0) {
      return logMessage('no files, skipping')
    }

    const { rnResolve } = await import('rn-resolve')
    const { runSimulator, installApp, launchApp, serveJsBundle } = await import('@rebox/ios')
    const { runServer, prepareFiles } = await import('@x-ray/native-screenshots')

    const entryPointPath = await rnResolve('@x-ray/native-screenshots-app')

    await prepareFiles(entryPointPath, files.map((file) => file.path))

    let killServer = null
    let killSimulator = null

    try {
      killServer = await serveJsBundle({
        entryPointPath,
        isDev: false,
      })

      logMessage('server is ready')

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

      if (killServer !== null) {
        killServer()
      }
    }
  })
