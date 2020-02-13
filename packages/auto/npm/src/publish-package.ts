import path from 'path'
import execa from 'execa'
import { TPackageBump, TNpmConfig } from '@auto/utils'
import { getPackage } from '@auto/fs'
import { compileNpmConfig } from './compile-npm-config'

export const publishPackage = async (bumpPackage: TPackageBump, npmConfig?: TNpmConfig) => {
  const packageJson = await getPackage(bumpPackage.dir)
  const config = compileNpmConfig(npmConfig, packageJson.auto?.npm)

  await execa('npm', [
    'publish',
    '--registry',
    config.registry,
    '--access',
    config.access,
    path.join(bumpPackage.dir, config.publishSubDirectory),
  ], {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: 'ignore',
  })
}
