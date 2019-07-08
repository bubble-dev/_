/* eslint-disable import/named */
import { createServer } from 'http'
import { createReadStream } from 'fs'
import path from 'path'
import plugin, { StartFilesProps } from '@start/plugin'

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

export default (appPath: string) => plugin<StartFilesProps, void>('x-ray-ios-screenshots', ({ logMessage }) => async ({ files }) => {
  if (process.platform !== 'darwin') {
    return logMessage('BUY A MAC')
  }

  if (files.length === 0) {
    return logMessage('no files, skipping')
  }

  const { default: execa } = await import('execa')
  const { buildJsBundle } = await import('@rebox/ios')
  const { runServer, prepareFiles } = await import('@x-ray/native-screenshots')
  const deviceInfo = await getDeviceInfo()

  if (deviceInfo === null) {
    throw new Error('Unable to find iOS 11.3 + iPhone 7 Simulator')
  }

  logMessage(`device id ${deviceInfo.udid}`)

  await prepareFiles(files.map((file) => file.path))
  await buildJsBundle({
    entryPointPath: '@x-ray/native-screenshots-app',
    outputPath: appPath,
  })

  logMessage('x-ray bundle is ready')

  const httpServer = createServer((req, res) => {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/javascript' })

      const fileStream = createReadStream(path.join(appPath, 'main.jsbundle'))

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

  try {
    // if (deviceInfo.state !== 'Booted') {
    //   await execa('xcrun', ['simctl', 'boot', deviceInfo.udid])
    // }

    logMessage('device is ready')

    await execa('xcrun', ['simctl', 'install', 'booted', appPath])

    logMessage('x-ray app is installed')

    const runScreenshots = await runServer({ platform: 'ios' })

    await execa('xcrun', ['simctl', 'launch', 'booted', 'org.bubble-dev.xray'])

    logMessage('x-ray app is launching')

    await runScreenshots()
  } finally {
    // await execa('xcrun', ['simctl', 'shutdown', deviceInfo.udid])
    httpServer.close()
  }
})
