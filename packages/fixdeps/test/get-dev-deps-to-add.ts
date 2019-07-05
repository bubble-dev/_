import test from 'blue-tape'
import { getDevDepsToAdd } from '../src/get-dev-deps-to-add'

test('getDevDepsToAdd: add missing dependencies', (t) => {
  t.deepEquals(
    getDevDepsToAdd(
      {
        name: 'pkg',
        version: '0.0.0',
      },
      [
        '@ns/a',
        'execa',
      ],
      []
    ),
    [
      '@ns/a',
      'execa',
    ],
    'should return list of deps to be added'
  )

  t.deepEquals(
    getDevDepsToAdd(
      {
        name: 'pkg',
        version: '0.0.0',
      },
      [
        '@ns/a',
        'execa',
        'fs',
      ],
      [
        'fs',
      ]
    ),
    [
      '@ns/a',
      'execa',
    ],
    'should check for ignored deps'
  )

  t.deepEquals(
    getDevDepsToAdd(
      {
        name: 'pkg',
        version: '0.0.0',
        dependencies: {
          execa: '^1.0.0',
        },
      },
      [
        '@ns/a',
        'execa',
      ],
      []
    ),
    [
      '@ns/a',
    ],
    'should check for existing deps in dependencies object'
  )

  t.deepEquals(
    getDevDepsToAdd(
      {
        name: 'pkg',
        version: '0.0.0',
        devDependencies: {
          execa: '^1.0.0',
        },
      },
      [
        '@ns/a',
        'execa',
      ],
      []
    ),
    [
      '@ns/a',
    ],
    'should check for existing deps in devDependencies object'
  )

  t.deepEquals(
    getDevDepsToAdd(
      {
        name: 'pkg',
        version: '0.0.0',
        peerDependencies: {
          execa: '^1.0.0',
        },
      },
      [
        '@ns/a',
        'execa',
      ],
      []
    ),
    [
      '@ns/a',
      'execa',
    ],
    'should check for existing deps in peerDependencies object'
  )

  t.deepEquals(
    getDevDepsToAdd(
      {
        name: 'pkg',
        version: '0.0.0',
        dependencies: {
          '@ns/a': '^2.0.0',
        },
        devDependencies: {
          execa: '^1.0.0',
        },
      },
      [
        '@ns/a',
        'execa',
      ],
      []
    ),
    [],
    'should return empty list if nothing to add'
  )

  t.end()
})
