import plugin from '@start/plugin'
import sequence from '@start/plugin-sequence'
import find from '@start/plugin-find'
import remove from '@start/plugin-remove'
import env from '@start/plugin-env'
import typescriptCheck from '@start/plugin-lib-typescript-check'
import tape from '@start/plugin-lib-tape'
import { istanbulInstrument, istanbulReport } from '@start/plugin-lib-istanbul'
import { TPackageJson } from 'fixdeps'
import xRaySnapshots from './plugins/snapshots'
import xRayChromeScreenshots from './plugins/chrome-screenshots'
import xRayFirefoxScreenshots from './plugins/firefox-screenshots'
import xRayChromePerfSnapshots from './plugins/chrome-perf-snapshots'
import xRayIosScreenshots from './plugins/ios-screenshots'
import xRayAndroidScreenshots from './plugins/android-screenshots'
import xRayIosWebScreenshots from './plugins/ios-web-screenshots'
import xRayAndroidWebScreenshots from './plugins/android-web-screenshots'
import withChromium from './plugins/with-chromium'
import waitForChromium from './plugins/wait-for-chromium'
import waitForFirefox from './plugins/wait-for-firefox'
import withFirefox from './plugins/with-firefox'

export const CheckWebSnapshots = (baseDir: string = 'packages') => (component = '**') =>
  sequence(
    find(`${baseDir}/${component}/x-ray/snapshots.{jsx,tsx}`),
    env({ NODE_ENV: 'production' }),
    xRaySnapshots({
      platform: 'web',
      extensions: [
        '.web.js',
        '.web.jsx',
        '.web.ts',
        '.web.tsx',
        '.js',
        '.jsx',
        '.ts',
        '.tsx',
      ],
      entryPointField: 'main',
    })
  )

export const checkWebSnapshots = CheckWebSnapshots()

export const CheckNativeSnapshots = (baseDir: string = 'packages') => (component = '**') =>
  sequence(
    find(`${baseDir}/${component}/x-ray/snapshots.{jsx,tsx}`),
    env({ NODE_ENV: 'production' }),
    xRaySnapshots({
      platform: 'native',
      mocks: {
        'react-native': require.resolve('./mocks/react-native.js'),
        'react-native-svg': require.resolve('./mocks/react-native-svg.js'),
      },
      extensions: [
        '.native.js',
        '.native.jsx',
        '.native.ts',
        '.native.tsx',
        '.ios.js',
        '.ios.jsx',
        '.ios.ts',
        '.ios.tsx',
        '.js',
        '.jsx',
        '.ts',
        '.tsx',
      ],
      entryPointField: 'react-native',
    })
  )

export const checkNativeSnapshots = CheckNativeSnapshots()

export const CheckChromeScreenshots = (fontsDir?: string, baseDir: string = 'packages') => (component = '**') =>
  withChromium(
    sequence(
      find(`${baseDir}/${component}/x-ray/screenshots.{jsx,tsx}`),
      waitForChromium,
      env({ NODE_ENV: 'production' }),
      xRayChromeScreenshots({
        platform: 'chrome',
        extensions: [
          '.web.js',
          '.web.jsx',
          '.web.ts',
          '.web.tsx',
          '.jsx',
          '.js',
          '.ts',
          '.tsx',
        ],
        entryPointField: 'main',
      })
    ),
    fontsDir
  )

export const CheckFirefoxScreenshots = (fontsDir?: string, baseDir: string = 'packages') => (component = '**') =>
  withFirefox(
    sequence(
      find(`${baseDir}/${component}/x-ray/screenshots.{jsx,tsx}`),
      waitForFirefox,
      env({ NODE_ENV: 'production' }),
      xRayFirefoxScreenshots({
        platform: 'firefox',
        extensions: [
          '.web.js',
          '.web.jsx',
          '.web.ts',
          '.web.tsx',
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
        ],
        entryPointField: 'main',
      })
    ),
    fontsDir
  )

export const CheckChromePerfSnapshots = (fontsDir?: string, baseDir: string = 'packages') => (component = '**') => {
  return sequence(
    find(`${baseDir}/${component}/x-ray/perf-snapshots.{jsx,tsx}`),
    env({ NODE_ENV: 'production' }),
    xRayChromePerfSnapshots(fontsDir)
  )
}

export const CheckIosScreenshots = (fontsDir?: string, baseDir: string = 'packages') => (component = '**') => {
  return sequence(
    find(`${baseDir}/${component}/x-ray/screenshots.{jsx,tsx}`),
    env({ NODE_ENV: 'production' }),
    xRayIosScreenshots(fontsDir)
  )
}

export const CheckAndroidScreenshots = (fontsDir?: string, baseDir: string = 'packages') => (component = '**') => {
  return sequence(
    find(`${baseDir}/${component}/x-ray/screenshots.{jsx,tsx}`),
    env({ NODE_ENV: 'production' }),
    xRayAndroidScreenshots(fontsDir)
  )
}

export const CheckIosWebScreenshots = (fontsDir?: string, baseDir: string = 'packages') => (component = '**') => {
  return sequence(
    find(`${baseDir}/${component}/x-ray/screenshots.{jsx,tsx}`),
    env({ NODE_ENV: 'production' }),
    xRayIosWebScreenshots(fontsDir)
  )
}

export const CheckAndroidWebScreenshots = (fontsDir?: string, baseDir: string = 'packages') => (component = '**') => {
  return sequence(
    find(`${baseDir}/${component}/x-ray/screenshots.{jsx,tsx}`),
    env({ NODE_ENV: 'production' }),
    xRayAndroidWebScreenshots(fontsDir)
  )
}

export const checkDeps = () => plugin('checkDeps', ({ logMessage }) => async () => {
  const path = await import('path')
  const { objectHas } = await import('tsfn')
  const { hasDepsToModify } = await import('fixdeps')
  const { getPackage, getPackageDirs } = await import('@auto/fs')
  const packageDirs = await getPackageDirs()

  const fixPackageDir = async (dir: string): Promise<boolean> => {
    const json: TPackageJson = await getPackage(dir)
    let ignoredPackages: string[] = ['@babel/runtime']
    let dependenciesGlobs = ['src/**/*.{ts,tsx,js,jsx}']
    let devDependenciesGlobs = ['{test,x-ray}/**/*.{ts,tsx,js,jsx}', 'meta.{js,jsx,ts,tsx}']

    if (objectHas(json, 'fixdeps')) {
      const options = json.fixdeps

      if (objectHas(options, 'ignoredPackages')) {
        ignoredPackages = options.ignoredPackages
      }

      if (objectHas(options, 'dependenciesGlobs')) {
        dependenciesGlobs = options.dependenciesGlobs
      }

      if (objectHas(options, 'devDependenciesGlobs')) {
        devDependenciesGlobs = options.devDependenciesGlobs
      }
    }

    return hasDepsToModify({
      ignoredPackages,
      packagePath: dir,
      dependenciesGlobs,
      devDependenciesGlobs,
    })
  }

  for (const dir of Object.values(packageDirs)) {
    if (await fixPackageDir(dir)) {
      logMessage(`"${path.basename(dir)}" has unfixed dependencies`)
      throw null
    }
  }
})

export const lint = async () => {
  const { weslint } = await import('weslint')
  const path = await import('path')
  const packageJson = await import(path.resolve('package.json'))
  const globs = packageJson.workspaces.reduce((acc: string[], glob: string) => (
    acc.concat(
      `${glob}/{src,test,x-ray}/**/*.{ts,tsx,js,jsx}`,
      `${glob}/*.{ts,tsx,js,jsx}`
    )
  ), [] as string[])

  return sequence(
    find([
      ...globs,
      'tasks/**/*.{ts,js}',
    ]),
    plugin('weslint', () => async ({ files }) => {
      const result = await weslint({
        files: files.map((file) => file.path),
      })

      if (result.hasErrors || result.hasWarnings) {
        console.log(result.formattedReport)
      }

      if (result.hasErrors) {
        throw null
      }
    }),
    typescriptCheck()
  )
}

export const Test = (baseDir: string = 'packages') => async (packageDir: string = '**') => {
  // @ts-ignore
  const { default: tapDiff } = await import('tap-diff')

  return sequence(
    env({ NODE_ENV: 'test' }),
    find(`coverage/`),
    remove,
    find(`${baseDir}/${packageDir}/src/**/*.{ts,tsx,js,jsx}`),
    istanbulInstrument(['.ts', '.tsx', '.js', '.jsx']),
    find([
      `${baseDir}/${packageDir}/test/**/*.{ts,tsx,js,jsx}`,
      `!${baseDir}/${packageDir}/test/fixtures`,
    ]),
    tape(tapDiff),
    istanbulReport(['lcovonly', 'html', 'text-summary'])
  )
}

export const test = Test()

export const ci = () =>
  sequence(
    lint(),
    test(),
    checkDeps()
  )
