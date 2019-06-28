/* eslint-disable import/named */
import plugin, { StartFilesProps } from '@start/plugin'

const APP_PATH = 'tasks/x-ray/react-native/ios/app/Debug-iphonesimulator/xray.app'

type TDeviceList = {
  devices: {
    [k: string]: {
      name: string,
      udid: string,
      state: string,
    }[],
  },
}

const getDeviceInfo = async () => {
  const { default: execa } = await import('execa')
  const { stdout: xcrunList } = await execa('xcrun', ['simctl', 'list', '--json'])

  try {
    const devicesList = JSON.parse(xcrunList) as TDeviceList
    const devices = devicesList.devices['iOS 11.3'] || devicesList.devices['com.apple.CoreSimulator.SimRuntime.iOS-11-3']

    for (const device of devices) {
      if (device.name === 'iPhone 7') {
        return device
      }
    }

    return null
  } catch {
    return null
  }
}

export default plugin<StartFilesProps, void>('x-ray-ios-screenshots', ({ logMessage }) => async ({ files }) => {
  if (process.platform !== 'darwin') {
    return logMessage('BUY A MAC')
  }

  if (files.length === 0) {
    return logMessage('no files, skipping')
  }

  const { default: execa } = await import('execa')
  const { buildIos } = await import('@rebox/ios')
  const { runServer, prepareFiles } = await import('@x-ray/native-screenshots')
  const deviceInfo = await getDeviceInfo()

  if (deviceInfo === null) {
    throw new Error('Unable to find iOS 11.3 + iPhone 7 Simulator')
  }

  logMessage(`device id ${deviceInfo.udid}`)

  await prepareFiles(files.map((file) => file.path))

  await buildIos({
    entryPointPath: '@x-ray/native-screenshots/build/App',
    outputPath: '.rebox/ios/',
    osVersion: 'latest',
    platformName: 'iOS Simulator',
    appName: 'X-Ray',
  })

  logMessage('x-ray app is ready')

  try {
    if (deviceInfo.state !== 'Booted') {
      await execa('xcrun', ['simctl', 'boot', deviceInfo.udid])
    }

    // const simulatorProcess = execa('/Applications/Xcode.app/Contents/Developer/Applications/Simulator.app/Contents/MacOS/Simulator', ['-CurrentDeviceUDID', iPhone7Id])
    // while ((await getDeviceInfo()).state !== 'Booted') {
    //   await pSleep(500)
    // }

    logMessage('device is ready')

    // build an app:
    // react-native start --skipflow --projectRoot tasks/x-ray/react-native
    // react-native run-ios --no-packager --project-path tasks/x-ray/react-native/ios --simulator 'iPhone 7'
    await execa('xcrun', ['simctl', 'install', deviceInfo.udid, APP_PATH])

    logMessage('x-ray app is installed')

    const runScreenshots = await runServer({ platform: 'ios' })

    await execa('xcrun', ['simctl', 'launch', deviceInfo.udid, 'org.reactjs.native.example.xray'])

    logMessage('x-ray app is launching')

    await runScreenshots()
  } finally {
    await execa('xcrun', ['simctl', 'shutdown', deviceInfo.udid])
  }
})
