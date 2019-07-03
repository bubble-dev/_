import path from 'path'
import { promisify } from 'util'
import { readFile, writeFile } from 'graceful-fs'
import execa from 'execa'
import moveFile from 'move-file'

const pReadFile = promisify(readFile)
const pWriteFile = promisify(writeFile)

export type TBuildJsBundleOptions = {
  entryPointPath: string,
  outputPath: string,
}

export const buildJsBundle = async (options: TBuildJsBundleOptions) => {
  await execa(
    'haul',
    [
      'bundle',
      '--config',
      require.resolve('./haul.config.js'),
      '--platform',
      'android',
      '--dev',
      'false',
      '--minify',
      'true',
      '--progress',
      'none',
      '--bundle-output',
      options.outputPath,
    ],
    {
      stderr: process.stderr,
      env: {
        FORCE_COLOR: '1',
        REBOX_ENTRY_POINT: options.entryPointPath,
      },
    }
  )
}

export type TBuildReleaseOptions = {
  entryPointPath: string,
  appName: string,
  appId: string,
  outputPath: string,
}

export const buildRelease = async (options: TBuildReleaseOptions) => {
  const androidPath = path.join('node_modules', '@rebox', 'android', 'android')

  await buildJsBundle({
    entryPointPath: options.entryPointPath,
    outputPath: path.join(androidPath, 'app', 'src', 'main', 'assets', 'index.android.bundle'),
  })

  await execa(
    path.resolve(androidPath, 'gradlew'),
    [
      'clean',
      '--console=plain',
      '--quiet',
      '--no-daemon',
      '--warning-mode=none',
    ],
    {
      cwd: androidPath,
      stderr: process.stderr,
      env: {
        FORCE_COLOR: '1',
      },
    }
  )

  const stringsXmlPath = path.join(androidPath, 'app', 'src', 'main', 'res', 'values', 'strings.xml')

  await pWriteFile(stringsXmlPath, `<resources><string name="app_name">${options.appName}</string></resources>`)

  const buildGradlePath = path.join(androidPath, 'app', 'build.gradle')

  let buildGradleData = await pReadFile(buildGradlePath, 'utf8')

  buildGradleData = buildGradleData.replace('applicationId "com.rebox"', `applicationId "${options.appId}"`)

  await pWriteFile(buildGradlePath, buildGradleData)

  await execa(
    path.resolve(androidPath, 'gradlew'),
    [
      'assembleRelease',
      '--console=plain',
      '--quiet',
      '--no-daemon',
      '--warning-mode=none',
    ],
    {
      cwd: androidPath,
      stderr: process.stderr,
      env: {
        FORCE_COLOR: '1',
      },
    }
  )

  await pWriteFile(stringsXmlPath, '<resources><string name="app_name">rebox</string></resources>')

  const originalApkPath = path.join(androidPath, 'app', 'build', 'outputs', 'apk', 'release', 'app-release-unsigned.apk')
  const newApkPath = path.join(options.outputPath, `${options.appName}.apk`)

  await moveFile(originalApkPath, newApkPath)
}

export type TBuildDebugOptions = {
  appName: string,
  appId: string,
  outputPath: string,
}

export const buildDebug = async (options: TBuildDebugOptions) => {
  const androidPath = path.join('node_modules', '@rebox', 'android', 'android')

  await execa(
    path.resolve(androidPath, 'gradlew'),
    [
      'clean',
      '--console=plain',
      '--quiet',
      '--no-daemon',
      '--warning-mode=none',
    ],
    {
      cwd: androidPath,
      stderr: process.stderr,
      env: {
        FORCE_COLOR: '1',
      },
    }
  )

  const stringsXmlPath = path.join(androidPath, 'app', 'src', 'main', 'res', 'values', 'strings.xml')

  await pWriteFile(stringsXmlPath, `<resources><string name="app_name">${options.appName}</string></resources>`)

  const buildGradlePath = path.join(androidPath, 'app', 'build.gradle')

  let buildGradleData = await pReadFile(buildGradlePath, 'utf8')

  buildGradleData = buildGradleData.replace('applicationId "com.rebox"', `applicationId "${options.appId}"`)

  await pWriteFile(buildGradlePath, buildGradleData)

  await execa(
    path.resolve(androidPath, 'gradlew'),
    [
      'assembleDebug',
      '--console=plain',
      '--quiet',
      '--no-daemon',
      '--warning-mode=none',
    ],
    {
      cwd: androidPath,
      stderr: process.stderr,
      env: {
        FORCE_COLOR: '1',
      },
    }
  )

  await pWriteFile(stringsXmlPath, '<resources><string name="app_name">rebox</string></resources>')

  const originalApkPath = path.join(androidPath, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk')
  const newApkPath = path.join(options.outputPath, `${options.appName}.apk`)

  await moveFile(originalApkPath, newApkPath)
}
