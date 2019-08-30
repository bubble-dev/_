import plugin, { StartFilesProps } from '@start/plugin'

export default (appPath: string) =>
  plugin<StartFilesProps, void>('x-ray-android-screenshots', ({ logMessage }) => async ({ files }) => {
    if (files.length === 0) {
      return logMessage('no files, skipping')
    }

    const path = await import('path')
    const { rnResolve } = await import('rn-resolve')
    const { broResolve } = await import('bro-resolve')
    const { runEmulator, serveJsBundle, installApp, launchApp } = await import('@rebox/android')
    const { run: runWeb } = await import('@rebox/web')
    const { runScreenshotsServer, prepareFiles } = await import('@x-ray/native-screenshots')
    const { runServer: runUiServer } = await import('@x-ray/screenshot-utils')

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
        isHeadless: true,
        portsToForward: [3002, 8081],
      })

      logMessage('device is ready')

      const runScreenshots = await runScreenshotsServer({ platform: 'android', dpr: 3 })

      await installApp({ appPath })

      logMessage('app is installed')

      await launchApp({ appId: 'org.bubble_dev.xray' })

      logMessage('app is launched')

      const { result, resultData, hasBeenChanged } = await runScreenshots()

      killEmulator()

      if (hasBeenChanged) {
        const entryPointPath = await broResolve('@x-ray/ui')
        const htmlTemplatePath = path.join(path.dirname(entryPointPath), 'index.html')

        const closeReboxServer = await runWeb({
          entryPointPath,
          htmlTemplatePath,
          isQuiet: true,
        })

        console.log('open http://localhost:3000/ to approve or discard changes')

        await runUiServer({
          platform: 'android',
          result,
          resultData,
        })
        await closeReboxServer()
      }
    } finally {
      if (killEmulator !== null) {
        killEmulator()
      }

      if (killServer !== null) {
        killServer()
      }
    }
  })