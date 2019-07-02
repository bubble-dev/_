import path from 'path'
import plugin from '@start/plugin'
import sequence from '@start/plugin-sequence'
import find from '@start/plugin-find'
import env from '@start/plugin-env'
import remove from '@start/plugin-remove'
import { build } from '@bubble-dev/start-preset'
import xRayChromeScreenshots from './plugins/chrome-screenshots-plugin'
import xRayFirefoxScreenshots from './plugins/firefox-screenshots-plugin'
import xRayIosScreenshots from './plugins/ios-screenshots-plugin'
import xRaySnapshots from './plugins/snapshots-plugin'
import withChromium from './plugins/with-chromium'
import waitForChromium from './plugins/wait-for-chromium'
import waitForFirefox from './plugins/wait-for-firefox'
import withFirefox from './plugins/with-firefox'

export const checkWebSnapshots = (component = '**') =>
  sequence(
    find(`packages/${component}/test/snapshots.tsx`),
    env({ NODE_ENV: 'production' }),
    xRaySnapshots({
      platform: 'web',
      extensions: [
        '.web.js',
        '.web.ts',
        '.web.tsx',
        '.js',
        '.ts',
        '.tsx',
      ],
    })
  )

export const checkNativeSnapshots = (component = '**') =>
  sequence(
    find(`packages/${component}/test/snapshots.tsx`),
    env({ NODE_ENV: 'production' }),
    xRaySnapshots({
      platform: 'native',
      mocks: {
        'react-native': path.resolve('tasks/x-ray/mocks/react-native.js'),
        'react-native-svg': path.resolve('tasks/x-ray/mocks/react-native-svg.js'),
      },
      extensions: [
        '.native.js',
        '.native.ts',
        '.native.tsx',
        '.ios.js',
        '.ios.ts',
        '.ios.tsx',
        '.js',
        '.ts',
        '.tsx',
      ],
    })
  )

export const checkChromeScreenshots = (component = '**') =>
  withChromium(
    sequence(
      find(`packages/${component}/test/screenshots.tsx`),
      waitForChromium,
      env({ NODE_ENV: 'production' }),
      xRayChromeScreenshots({
        platform: 'chrome',
        extensions: [
          '.web.js',
          '.web.ts',
          '.web.tsx',
          '.js',
          '.ts',
          '.tsx',
        ],
      })
    )
  )

export const checkFirefoxScreenshots = (component = '**') =>
  withFirefox(
    sequence(
      find(`packages/${component}/test/screenshots.tsx`),
      waitForFirefox,
      env({ NODE_ENV: 'production' }),
      xRayFirefoxScreenshots({
        platform: 'firefox',
        extensions: [
          '.web.js',
          '.web.ts',
          '.web.tsx',
          '.js',
          '.ts',
          '.tsx',
        ],
      })
    )
  )

export const checkIosScreenshots = (component = '**') =>
  sequence(
    find(`packages/${component}/test/screenshots.tsx`),
    env({ NODE_ENV: 'production' }),
    xRayIosScreenshots
  )

export const buildXRayIos = () =>
  sequence(
    build('x-ray/native-screenshots'),
    find('.rebox/ios/'),
    remove,
    plugin('ios', () => async () => {
      const { buildIos } = await import('@rebox/ios')

      await buildIos({
        entryPointPath: '@x-ray/native-screenshots/build/native/App',
        outputPath: '.rebox/ios/',
        osVersion: 'latest',
        platformName: 'iOS Simulator',
        appName: 'X-Ray',
        bundleId: 'org.reactjs.native.x-ray',
      })
    })
  )

export const tmp = () =>
  plugin('tmp', () => async () => {
    const { linkLibIos } = await import('rn-link')

    await linkLibIos(
      'packages/rebox/ios/ios',
      'node_modules/react-native-view-shot/ios/RNViewShot.xcodeproj/project.pbxproj'
    )
  })
