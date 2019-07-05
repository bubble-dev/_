import test from 'blue-tape'
import { getDepsToRemove } from '../src/get-deps-to-remove'

test('getDepsToRemove: remove unused dependencies', (t) => {
  t.deepEquals(
    getDepsToRemove(
      {
        name: 'pkg',
        version: '0.0.0',
        dependencies: {
          '@babel/runtime': '^1.0.0',
          '@ns/a': '^1.0.0',
          '@ns/b': '^1.0.0',
        },
        devDependencies: {
          execa: '^1.0.0',
          '@types/execa': '^1',
          tape: '^1.0.0',
          '@types/tape': '^1.0.0',
          '@types/react': '^16',
        },
        peerDependencies: {
          react: '^16',
        },
      },
      [
        '@ns/a',
        'execa',
      ],
      [
        '@babel/runtime',
      ]
    ),
    [
      '@ns/b',
      'tape',
      '@types/tape',
    ],
    'should return list of dependencies to be removed'
  )

  t.deepEquals(
    getDepsToRemove(
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
    [],
    'should return empty list if nothing to be removed'
  )

  t.end()
})
