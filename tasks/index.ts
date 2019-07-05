/* eslint-disable import/no-extraneous-dependencies */
import { fixdeps } from 'fixdeps'
import plugin from '@start/plugin'
import { getWorkspacesPackageDirs } from '@auto/fs'

export * from '@bubble-dev/start-preset'

// custom tasks:
export const fixDeps = () => plugin('fixDeps', () => async () => {
  const packages = await getWorkspacesPackageDirs()

  for (const pkg of packages) {
    await fixdeps({
      ignoredPackages: [
        '@babel/runtime',
      ],
      packagePath: pkg,
      dependencyFilesGlobs: ['src/**/*.{ts,tsx,js}'],
      devDependencyFilesGlobs: ['test/**/*.{ts,tsx,js}', 'meta.{ts,tsx}'],
    })
  }
})
