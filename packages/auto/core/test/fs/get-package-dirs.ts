import { promisify } from 'util'
import test from 'tape'
import { mock, deleteFromCache } from 'mocku'
import { createFsFromVolume, Volume } from 'memfs'

const rootDir = process.cwd()

test('fs:getPackageDirs workspaces[]', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({
      workspaces: ['fakes/*'],
    }),
    [`${rootDir}/fakes/a/package.json`]: '',
    [`${rootDir}/fakes/b/readme.md`]: '',
    [`${rootDir}/fakes/c/package.json`]: '',
  })
  const fs = createFsFromVolume(vol)

  const unmock = mock('../../src/fs/get-package-dirs', {
    fs,
    pifs: {
      readFile: promisify(fs.readFile),
    },
  })

  deleteFromCache('pifs')
  deleteFromCache('fast-glob')

  const { getPackageDirs } = await import('../../src/fs/get-package-dirs')

  t.deepEquals(
    await getPackageDirs(),
    [
      `${rootDir}/fakes/a`,
      `${rootDir}/fakes/c`,
    ],
    'should return packages directories'
  )

  unmock()
})

test('fs:getPackageDirs workspaces.packages[]', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({
      workspaces: {
        packages: ['fakes/*'],
      },
    }),
    [`${rootDir}/fakes/a/package.json`]: '',
    [`${rootDir}/fakes/b/readme.md`]: '',
    [`${rootDir}/fakes/c/package.json`]: '',
  })
  const fs = createFsFromVolume(vol)

  const unmock = mock('../../src/fs/get-package-dirs', {
    fs,
    pifs: {
      readFile: promisify(fs.readFile),
    },
  })

  deleteFromCache('fs')
  deleteFromCache('pifs')
  deleteFromCache('fast-glob')

  const { getPackageDirs } = await import('../../src/fs/get-package-dirs')

  t.deepEquals(
    await getPackageDirs(),
    [
      `${rootDir}/fakes/a`,
      `${rootDir}/fakes/c`,
    ],
    'should return packages directories'
  )

  unmock()
})

test('fs:getPackageDirs no workspaces', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({}),
    [`${rootDir}/fakes/a/package.json`]: '',
    [`${rootDir}/fakes/b/readme.md`]: '',
    [`${rootDir}/fakes/c/package.json`]: '',
  })
  const fs = createFsFromVolume(vol)

  const unmock = mock('../../src/fs/get-package-dirs', {
    fs,
    pifs: {
      readFile: promisify(fs.readFile),
    },
  })

  deleteFromCache('fs')
  deleteFromCache('pifs')
  deleteFromCache('fast-glob')

  const { getPackageDirs } = await import('../../src/fs/get-package-dirs')

  try {
    await getPackageDirs()

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, 'Cannot find "workspaces" field in "package.json"')
  }

  unmock()
})

test('fs:getPackageDirs no workspaces.packages', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: JSON.stringify({
      workspaces: {},
    }),
    [`${rootDir}/fakes/a/package.json`]: '',
    [`${rootDir}/fakes/b/readme.md`]: '',
    [`${rootDir}/fakes/c/package.json`]: '',
  })
  const fs = createFsFromVolume(vol)

  const unmock = mock('../../src/fs/get-package-dirs', {
    fs,
    pifs: {
      readFile: promisify(fs.readFile),
    },
  })

  deleteFromCache('fs')
  deleteFromCache('pifs')
  deleteFromCache('fast-glob')

  const { getPackageDirs } = await import('../../src/fs/get-package-dirs')

  try {
    await getPackageDirs()

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, 'Cannot find "workspaces.packages" field in "package.json"')
  }

  unmock()
})