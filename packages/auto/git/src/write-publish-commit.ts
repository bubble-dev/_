import path from 'path'
import execa from 'execa'
import { TPrefixes, TPackageBump, removeAutoNamePrefix } from '@auto/utils'

export const writePublishCommit = async (packageBumps: TPackageBump[], prefixes: TPrefixes) => {
  const bumps = packageBumps.filter((bump) => bump.type !== null && bump.version !== null)
  const names = bumps.map((bump) => removeAutoNamePrefix(bump.name)).join(', ')
  const packageJsonPaths = bumps.map((bump) => path.join(bump.dir, 'package.json'))
  const packageChangelogPaths = bumps.map((bump) => path.join(bump.dir, 'changelog.md'))

  if (bumps.length > 0) {
    await execa(
      'git',
      [
        'commit',
        '-m',
        `${prefixes.required.publish.value} ${names}: release`,
        ...packageJsonPaths,
        ...packageChangelogPaths,
      ],
      {
        stdout: 'ignore',
        stderr: 'ignore',
      }
    )
  }
}
