/* eslint-disable import/no-extraneous-dependencies */
import { fixdeps } from 'fixdeps'
import plugin from '@start/plugin'

export * from '@bubble-dev/start-preset'

// custom tasks:
export const fixDeps = () => plugin('fixDeps', ({ logMessage, logPath }) => () => fixdeps({
  ignoredPackages: [
    'react',
    'react-native',
    '@types/react',
    '@types/react-native',
    '@babel/runtime',
  ],
  logMessage,
  logPath,
  workspacePackagesFilter: (name) => name.includes('autoprops'),
}))
