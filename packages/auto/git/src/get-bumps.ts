import { TGitBump, TPackages, TPrefixes } from '@auto/utils'
import { getCommitMessages } from './get-commit-messages'
import { parseCommitMessage } from './parse-commit-message'

type TGitBumps = {
  [key: string]: TGitBump,
}

export const getBumps = async (packages: TPackages, prefixes: TPrefixes): Promise<TGitBump[]> => {
  const messages = await getCommitMessages()
  const bumps: TGitBumps = {}
  const completedPackages: string[] = []
  const packageNames = Object.keys(packages)

  for (const message of messages) {
    const parsed = parseCommitMessage(message, packageNames, prefixes)

    if (parsed === null) {
      continue
    }

    for (const name of parsed.names) {
      if (completedPackages.includes(name)) {
        continue
      }

      if (parsed.type === 'publish') {
        completedPackages.push(name)
        continue
      }

      if (parsed.type === 'initial') {
        bumps[name] = {
          name,
          messages: [{
            type: parsed.type,
            value: parsed.message,
            description: parsed.description,
          }],
        }

        completedPackages.push(name)
        continue
      }

      if (Reflect.has(bumps, name)) {
        const bump = bumps[name]

        bump.messages.push({
          type: parsed.type,
          value: parsed.message,
          description: parsed.description,
        })
      } else {
        bumps[name] = {
          name,
          messages: [{
            type: parsed.type,
            value: parsed.message,
            description: parsed.description,
          }],
        }
      }
    }

    if (packageNames.length === completedPackages.length) {
      break
    }
  }

  return Object.values(bumps)
}
