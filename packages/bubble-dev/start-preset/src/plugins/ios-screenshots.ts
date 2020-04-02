import plugin, { StartFilesProps } from '@start/plugin'

export default (fontsDir?: string) => plugin<StartFilesProps, void>('x-ray', ({ logMessage }) => async ({ files }) => {
  if (files.length === 0) {
    return logMessage('no files, skipping')
  }

  const path = await import('path')
  const { rsolve } = await import('rsolve')
  const { runIosApp } = await import('@rebox/ios')
  const { runWebApp } = await import('@rebox/web')
  const { runScreenshotsServer, prepareFiles } = await import('@x-ray/native-screenshots')
  const { runServer: runUiServer } = await import('@x-ray/screenshot-utils')

  const entryPointPath = await rsolve('@x-ray/native-screenshots-app', 'react-native')

  await prepareFiles(entryPointPath, files.map((file) => file.path))

  const runScreenshots = await runScreenshotsServer({ platform: 'ios', dpr: 2 })

  let killAll = null

  try {
    killAll = await runIosApp({
      appName: 'X-Ray',
      appId: 'org.bubble-dev.x-ray',
      iPhoneVersion: 8,
      iOSVersion: '13.2',
      entryPointPath,
      fontsDir,
      dependencyNames: [
        'react-native-svg',
        'react-native-view-shot',
      ],
      isHeadless: true,
      logMessage,
    })

    const { result, resultData, hasBeenChanged } = await runScreenshots()

    killAll()

    if (hasBeenChanged) {
      const entryPointPath = await rsolve('@x-ray/ui', 'browser')
      const htmlTemplatePath = path.join(path.dirname(entryPointPath), 'index.html')

      const closeReboxServer = await runWebApp({
        entryPointPath,
        htmlTemplatePath,
        isQuiet: true,
      })

      console.log('open http://localhost:3000/ to approve or discard changes')

      await runUiServer({
        platform: 'ios',
        result,
        resultData,
      })
      await closeReboxServer()
    }
  } finally {
    if (killAll !== null) {
      killAll()
    }
  }
})
