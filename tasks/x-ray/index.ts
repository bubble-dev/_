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
import xRayAndroidScreenshots from './plugins/android-screenshots-plugin'
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

export const checkAndroidScreenshots = (component = '**') =>
  sequence(
    find(`packages/${component}/test/screenshots.tsx`),
    env({ NODE_ENV: 'production' }),
    xRayAndroidScreenshots
  )

export const buildXRayIos = () =>
  sequence(
    // build('x-ray/native-screenshots'),
    find('.rebox/ios/'),
    remove,
    plugin('link', () => async () => {
      const { linkDependencyIos } = await import('rn-link')

      linkDependencyIos({
        projectPath: 'packages/rebox/ios/ios',
        dependencyPath: 'node_modules/react-native-view-shot/ios',
      })
    }),
    plugin('build', () => async () => {
      const { buildDebug } = await import('@rebox/ios')

      await buildDebug({
        // entryPointPath: '@x-ray/native-screenshots/build/native/App',
        outputPath: '.rebox/ios/',
        osVersion: 'latest',
        platformName: 'iOS Simulator',
        appName: 'X-Ray',
        appId: 'org.bubble-dev.xray',
      })
    })
  )

export const buildXRayAndroid = () =>
  sequence(
    // build('x-ray/native-screenshots'),
    find('.rebox/android/'),
    remove,
    plugin('link', () => async () => {
      const { linkDependencyAndroid } = await import('rn-link')

      linkDependencyAndroid({
        projectPath: 'packages/rebox/android',
        dependencyName: 'react-native-view-shot',
        dependencyPath: 'node_modules/react-native-view-shot',
      })
    }),
    plugin('build', () => async () => {
      const { buildDebug } = await import('@rebox/android')

      await buildDebug({
        outputPath: '.rebox/android/',
        appName: 'X-Ray',
        appId: 'org.bubble_dev.xray',
      })
    })
  )
