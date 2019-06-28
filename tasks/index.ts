import path from 'path'
import sequence from '@start/plugin-sequence'
import find from '@start/plugin-find'
import env from '@start/plugin-env'
import xRayChromeScreenshots from './plugins/chrome-screenshots-plugin'
import xRayWebSnapshots from './plugins/web-snapshots-plugin'
import withChromium from './plugins/with-chromium'
import waitForPort from './plugins/wait-for-port'

export * from '@bubble-dev/start-preset'

// custom tasks:
export const checkWebSnapshots = (component = '**') =>
  sequence(
    find(`packages/${component}/test/snapshots.tsx`),
    env({ NODE_ENV: 'production' }),
    xRayWebSnapshots({
      setupFile: path.resolve('tasks/setup/web.js'),
    })
  )

export const checkChromeScreenshots = (component = '**') =>
  withChromium(
    sequence(
      find(`packages/${component}/test/screenshots.tsx`),
      waitForPort(9222),
      env({ NODE_ENV: 'production', XRAY_SCREENSHOTS: '1' }),
      xRayChromeScreenshots({
        setupFile: path.resolve('tasks/setup/web.js'),
      })
    )
  )
