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

test('npm:publishPackage, with relative directory', async (t) => {
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
    },
    {
      publishSubDirectory: 'build',
    }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'https://registry.npmjs.org/', '--access', 'restricted', '/foo/bar/baz/build']],
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock()
})

test('npm:publishPackage, user provided registry', async (t) => {
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
    },
    {
      registry: 'https://custom-registry',
    }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'https://custom-registry', '--access', 'restricted', '/foo/bar/baz']],
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock()
})

test('npm:publishPackage, packageJson registry', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  const unmock = mock('../src/publish-package', {
    execa: { default: execaSpy },
    '@auto/fs': {
      getPackage: () => Promise.resolve({
        name: 'baz',
        version: '1.2.3',
        publishConfig: {
          registry: 'https://my-registry',
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
    }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'https://my-registry', '--access', 'restricted', '/foo/bar/baz']],
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock()
})

test('npm:publishPackage, priority test', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  const unmock = mock('../src/publish-package', {
    execa: { default: execaSpy },
    '@auto/fs': {
      getPackage: () => Promise.resolve({
        name: 'baz',
        version: '1.2.3',
        publishConfig: {
          registry: 'https://my-registry',
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
      registry: 'https://options-registry',
    }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'https://options-registry', '--access', 'restricted', '/foo/bar/baz']],
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock()
})

test('npm:publishPackage, user provided access', async (t) => {
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
    },
    {
      access: 'public',
    }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'https://registry.npmjs.org/', '--access', 'public', '/foo/bar/baz']],
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock()
})
