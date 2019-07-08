/* eslint-disable import/no-extraneous-dependencies */
import plugin from '@start/plugin'

export * from '@bubble-dev/start-preset'

// custom tasks:
export const fixDeps = () => plugin('fixDeps', () => async () => {
  const { fixdeps } = await import('fixdeps')
  const { getWorkspacesPackageDirs } = await import('@auto/fs')
  const packages = await getWorkspacesPackageDirs()

  for (const pkg of packages) {
    await fixdeps({
      ignoredPackages: [
        '@babel/core',
        '@babel/runtime',
        '__REBOX_ENTRY_POINT__',
        '@typescript-eslint/eslint-plugin',
        '@typescript-eslint/parser',
        'eslint-plugin-import',
        'eslint-plugin-react',
        'eslint',
        'typescript',
        'react-dom',
        'react-hot-loader',
        'request',
      ],
      packagePath: pkg,
      dependencyFilesGlobs: ['src/**/*.{ts,tsx,js}'],
      devDependencyFilesGlobs: ['test/**/*.{ts,tsx,js}', 'meta.{ts,tsx}'],
    })
  }
})
