import plugin, { StartFilesProps } from '@start/plugin'

export default (appPath: string) =>
  plugin<StartFilesProps, void>('x-ray-android-screenshots', ({ logMessage }) => async ({ files }) => {
    if (files.length === 0) {
      return logMessage('no files, skipping')
    }

    const { rnResolve } = await import('rn-resolve')
    const { runEmulator, serveJsBundle, installApp, launchApp } = await import('@rebox/android')
    const { runServer, prepareFiles } = await import('@x-ray/native-screenshots')

    const entryPointPath = await rnResolve('@x-ray/native-screenshots-app')

    await prepareFiles(entryPointPath, files.map((file) => file.path))

    let killServer = null
    let killEmulator = null

    try {
      killServer = await serveJsBundle({
        entryPointPath,
        isDev: false,
      })

      logMessage('server is ready')

      killEmulator = await runEmulator({
        isHeadless: false,
        portsToForward: [3002, 8081],
      })

      logMessage('device is ready')

      const runScreenshots = await runServer({ platform: 'android' })

      await installApp({ appPath })

      logMessage('app is installed')

      await launchApp({ appId: 'org.bubble_dev.xray' })

      logMessage('app is launched')

      await runScreenshots()
    } finally {
      if (killEmulator !== null) {
        killEmulator()
      }

      if (killServer !== null) {
        killServer()
      }
    }
  })
