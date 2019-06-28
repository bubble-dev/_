import path from 'path'
import sequence from '@start/plugin-sequence'
import find from '@start/plugin-find'
import env from '@start/plugin-env'
import xRayChromeScreenshots from './plugins/chrome-screenshots-plugin'
import xRaySnapshots from './plugins/snapshots-plugin'
import withChromium from './plugins/with-chromium'
import waitForPort from './plugins/wait-for-port'

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
      waitForPort(9222),
      env({ NODE_ENV: 'production', XRAY_SCREENSHOTS: '1' }),
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
