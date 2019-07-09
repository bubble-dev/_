import path from 'path'
import execa from 'execa'

export type TBuildJsBundleOptions = {
  entryPointPath: string,
  outputPath: string,
}

export const buildJsBundle = async ({ entryPointPath, outputPath }: TBuildJsBundleOptions) => {
  const bundlePath = path.join(outputPath, 'main.jsbundle')

  await execa(
    'haul',
    [
      'bundle',
      '--config',
      require.resolve('./haul.config.js'),
      '--platform',
      'ios',
      '--dev',
      'false',
      '--minify',
      'false',
      '--progress',
      'none',
      '--bundle-output',
      bundlePath
    ],
    {
      stderr: process.stderr,
      env: {
        FORCE_COLOR: '1',
        REBOX_ENTRY_POINT: entryPointPath,
      },
    }
  )

  return bundlePath
}
