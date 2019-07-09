import path from 'path'
import execa from 'execa'
import { runEmulator } from './run-emulator'

// https://github.com/facebook/react-native/issues/9145
// https://github.com/facebook/react-native/pull/23616
const PORT = '8081'

export type TOptions = {
  projectPath: string,
  entryPointPath: string,
  portsToForward: number[],
}

export const run = async (options: TOptions) => {
  await runEmulator({
    isHeadless: false,
    portsToForward: [Number(PORT), ...options.portsToForward],
  })

  return Promise.all([
    execa(
      'haul',
      [
        'start',
        '--port',
        PORT,
        '--config',
        require.resolve('./haul.config.js'),
      ],
      {
        stdin: process.stdin,
        stdout: process.stdout,
        stderr: process.stderr,
        env: {
          FORCE_COLOR: '1',
          REBOX_ENTRY_POINT: options.entryPointPath,
        },
      }
    ),
    execa(
      'react-native',
      [
        'run-android',
        '--port',
        PORT,
        '--no-packager',
        '--root',
        path.join(options.projectPath, '..'),
      ],
      {
        stdout: process.stdout,
        stderr: process.stderr,
        env: {
          FORCE_COLOR: '1',
          RCT_METRO_PORT: PORT,
        },
      }
    ),
  ])
}
