import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { mock } from 'mocku'
import { prefixes } from '@auto/utils/test/prefixes'
import { TGithubOptions } from '../src/types'

const githubOptions: TGithubOptions = {
  token: 'token',
  username: 'username',
  repo: 'repo',
}

test('makeGithubReleases', async (t) => {
  const spy = createSpy(() => Promise.resolve())

  const unmock = mock('../src/make-github-releases', {
    'node-fetch': {
      default: spy,
    },
  })

  const { makeGithubReleases } = await import('../src/make-github-releases')

  await makeGithubReleases(
    [
      {
        name: '@ns/a',
        version: '0.1.2',
        type: 'minor',
        dir: 'dir',
        messages: [
          {
            type: 'minor',
            value: 'minor',
          },
          {
            type: 'patch',
            value: 'patch',
          },
        ],
      },
      {
        name: 'b',
        version: '1.2.3',
        type: 'minor',
        dir: 'dir',
        messages: [
          {
            type: 'minor',
            value: 'minor',
          },
          {
            type: 'patch',
            value: 'patch',
          },
        ],
      },
    ],
    prefixes,
    githubOptions
  )

  t.deepEquals(
    getSpyCalls(spy),
    [
      [
        'https://api.github.com/repos/username/repo/releases',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'token token',
            'User-Agent': 'auto-tools',
          },
          body: JSON.stringify({
            tag_name: 'ns/a@0.1.2',
            name: 'ns/a@0.1.2',
            body: '* 🌱 minor\n* 🐞 patch',
          }),
        },
      ],
      [
        'https://api.github.com/repos/username/repo/releases',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'token token',
            'User-Agent': 'auto-tools',
          },
          body: JSON.stringify({
            tag_name: 'b@1.2.3',
            name: 'b@1.2.3',
            body: '* 🌱 minor\n* 🐞 patch',
          }),
        },
      ],
    ],
    'should make request'
  )

  unmock()
})

test('makeGithubReleases: throws if there is no token', async (t) => {
  const spy = createSpy(() => Promise.resolve())

  const unmock = mock('../src/make-github-releases', {
    'node-fetch': {
      default: spy,
    },
  })

  const { makeGithubReleases } = await import('../src/make-github-releases')

  try {
    await makeGithubReleases(
      [
        {
          name: 'a',
          version: '0.1.2',
          type: 'minor',
          dir: 'dir',
          messages: [
            {
              type: 'minor',
              value: 'minor',
            },
            {
              type: 'patch',
              value: 'patch',
            },
          ],
        },
        {
          name: 'b',
          version: '1.2.3',
          type: 'minor',
          dir: 'dir',
          messages: [
            {
              type: 'minor',
              value: 'minor',
            },
            {
              type: 'patch',
              value: 'patch',
            },
          ],
        },
      ],
      prefixes,
      // @ts-ignore
      { ...githubOptions, token: undefined }
    )

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, 'GitHub token is required')
  }

  unmock()
})
