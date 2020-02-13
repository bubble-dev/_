import execa from 'execa'
import { TPackageBump, removeAutoNamePrefix } from '@auto/utils'

export const writePublishTags = async (packageBumps: TPackageBump[]) => {
  for (const bump of packageBumps) {
    if (bump.version === null || bump.type === null) {
      continue
    }

    const name = removeAutoNamePrefix(bump.name)

    await execa(
      'git',
      [
        'tag',
        '-m',
        `${name}@${bump.version}`,
        `${name}@${bump.version}`,
      ],
      {
        stdout: 'ignore',
        stderr: 'ignore',
      }
    )
  }
}
