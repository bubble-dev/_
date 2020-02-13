import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { mock } from 'mocku'

test('npm:publishPackage, default', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  const unmock = mock('../src/publish-package', {
    execa: { default: execaSpy },
    '@auto/fs': {
      getPackage: () => Promise.resolve({
        name: 'baz',
        version: '1.2.3',
      }),
    },
  })

  const { publishPackage } = await import('../src/publish-package')

  await publishPackage(
    {
      name: 'baz',
      dir: '/foo/bar/baz',
      version: '1.2.3',
      type: 'minor',
      deps: null,
      devDeps: null,
    }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'https://registry.npmjs.org/', '--access', 'restricted', '/foo/bar/baz']],
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock()
})

test('npm:publishPackage, overrides', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  const unmock = mock('../src/publish-package', {
    execa: { default: execaSpy },
    '@auto/fs': {
      getPackage: () => Promise.resolve({
        name: 'baz',
        version: '1.2.3',
        auto: {
          npm: {
            registry: 'http://local',
            publishSubDirectory: 'build',
          },
        },
      }),
    },
  })

  const { publishPackage } = await import('../src/publish-package')

  await publishPackage(
    {
      name: 'baz',
      dir: '/foo/bar/baz',
      version: '1.2.3',
      type: 'minor',
      deps: null,
      devDeps: null,
    },
    {
      access: 'public',
    }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'http://local', '--access', 'public', '/foo/bar/baz/build']],
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock()
})
