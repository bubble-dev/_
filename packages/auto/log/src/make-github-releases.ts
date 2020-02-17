import fetch from 'node-fetch'
import { TPrefixes, removeAutoNamePrefix } from '@auto/utils'
import { GITHUB_API_REPOS_URL } from './utils'
import { TGithubOptions, TLog } from './types'

export const makeGithubReleases = async (logs: TLog[], prefixes: TPrefixes, githubOptions: TGithubOptions) => {
  if (typeof githubOptions.token !== 'string') {
    throw new Error('GitHub token is required')
  }

  for (const log of logs) {
    const name = removeAutoNamePrefix(log.name)

    await fetch(
      `${GITHUB_API_REPOS_URL}${githubOptions.username}/${githubOptions.repo}/releases`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `token ${githubOptions.token}`,
          'User-Agent': 'auto-tools',
        },
        body: JSON.stringify({
          tag_name: `${name}@${log.version}`,
          name: `${name}@${log.version}`,
          body: log.messages
            .map((message) => `* ${prefixes.required[message.type].value} ${message.value}`)
            .join('\n'),
        }),
      }
    )
  }
}
