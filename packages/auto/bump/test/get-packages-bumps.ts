import test from 'blue-tape'
import { getPackagesBumps } from '../src/get-packages-bumps'

test('bump:getPackageBumps: single package', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        'ns/a': {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
      },
      [
        { name: 'ns/a', messages: [{ type: 'patch', value: '' }] },
      ]
    ),
    [
      {
        name: 'ns/a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
    ],
    'patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        'ns/a': {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        },
      },
      [
        { name: 'ns/a', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'ns/a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
    ],
    'minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        'ns/a': {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.2.1',
          },
        },
      },
      [
        { name: 'ns/a', messages: [{ type: 'major', value: '' }] },
      ]
    ),
    [
      {
        name: 'ns/a',
        dir: '/fakes/a',
        version: '0.3.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
    ],
    'major (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        'ns/a': {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.2.3',
          },
        },
      },
      [
        { name: 'ns/a', messages: [{ type: 'major', value: '' }] },
      ]
    ),
    [
      {
        name: 'ns/a',
        dir: '/fakes/a',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
    ],
    'major (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        'ns/a': {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.2.3',
            auto: {
              bump: {
                zeroBreakingChangeType: 'patch',
              },
            },
          },
        },
      },
      [
        { name: 'ns/a', messages: [{ type: 'major', value: '' }] },
      ]
    ),
    [
      {
        name: 'ns/a',
        dir: '/fakes/a',
        version: '0.2.4',
        type: 'major',
        deps: null,
        devDeps: null,
      },
    ],
    'major override (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        'ns/a': {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
      },
      [
        { name: 'ns/a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'minor',
      }
    ),
    [
      {
        name: 'ns/a',
        dir: '/fakes/a',
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
    ],
    'initial'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        'ns/a': {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
            auto: {
              bump: {
                initialType: 'major',
              },
            },
          },
        },
      },
      [
        { name: 'ns/a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'minor',
      }
    ),
    [
      {
        name: 'ns/a',
        dir: '/fakes/a',
        version: '1.0.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
    ],
    'initial override'
  )

  t.end()
})

test('bump:getPackageBumps: multiple independent packages', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        'ns/a': {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: 'b',
            version: '0.2.1',
          },
        },
        'ns/c': {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '1.2.1',
          },
        },
        d: {
          dir: '/fakes/d',
          json: {
            name: 'd',
            version: '0.0.0',
            auto: {
              bump: {
                initialType: 'patch',
              },
            },
          },
        },
      },
      [
        { name: 'ns/a', messages: [{ type: 'patch', value: '' }] },
        { name: 'b', messages: [{ type: 'minor', value: '' }] },
        { name: 'ns/c', messages: [{ type: 'major', value: '' }] },
        { name: 'd', messages: [{ type: 'initial', value: '' }] },
      ]
    ),
    [
      {
        name: 'ns/a',
        dir: '/fakes/a',
        version: '0.1.2',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '0.3.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'ns/c',
        dir: '/fakes/c',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
      {
        name: 'd',
        dir: '/fakes/d',
        version: '0.0.1',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
    ],
    'multiple independent bumps'
  )

  t.end()
})

test('bump:getPackageBumps: b -> a (should always bump dependents)', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
      ],
      {
        shouldAlwaysBumpDependents: true,
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '0.1.1',
        },
        devDeps: null,
      },
    ],
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
      ],
      {
        shouldAlwaysBumpDependents: true,
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.3',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '~0.1.3',
        },
        devDeps: null,
      },
    ],
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
            auto: {
              bump: {
                shouldAlwaysBumpDependents: true,
              },
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.3',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '~0.1.3',
        },
        devDeps: null,
      },
    ],
    '~ patch (shouldAlwaysBumpDependent override)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
      ],
      {
        shouldAlwaysBumpDependents: true,
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '^0.2.0',
        },
        devDeps: null,
      },
    ],
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
      ],
      {
        shouldAlwaysBumpDependents: true,
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '^0.2.0',
        },
        devDeps: null,
      },
    ],
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
      ],
      {
        shouldAlwaysBumpDependents: true,
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '^1.2.0',
        },
        devDeps: null,
      },
    ],
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'major', value: '' }] },
      ],
      {
        shouldAlwaysBumpDependents: true,
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '^2.0.0',
        },
        devDeps: null,
      },
    ],
    '^ major'
  )

  t.end()
})

test('bump:getPackageBumps: b -> a', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '0.1.1',
        },
        devDeps: null,
      },
    ],
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.3',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
    ],
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '^0.2.0',
        },
        devDeps: null,
      },
    ],
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '^0.2.0',
        },
        devDeps: null,
      },
    ],
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
    ],
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'major', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '^2.0.0',
        },
        devDeps: null,
      },
    ],
    '^ major'
  )

  t.end()
})

test('bump:getPackageBumps: b -> ia', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'minor',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '0.1.0',
        },
        devDeps: null,
      },
    ],
    'exact version initial'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'patch',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.0.1',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '~0.0.1',
        },
        devDeps: null,
      },
    ],
    '~ initial patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'minor',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '~0.1.0',
        },
        devDeps: null,
      },
    ],
    '~ initial minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '0.2.3',
            dependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'minor',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '0.3.0',
        type: 'minor',
        deps: {
          a: '^0.1.0',
        },
        devDeps: null,
      },
    ],
    '^ initial minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'minor',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '^0.1.0',
        },
        devDeps: null,
      },
    ],
    '^ initial minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'major',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.0.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '^1.0.0',
        },
        devDeps: null,
      },
    ],
    '^ initial major'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
            auto: {
              bump: {
                initialType: 'major',
              },
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'minor',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.0.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '^1.0.0',
        },
        devDeps: null,
      },
    ],
    'initial type override'
  )

  t.end()
})

test('bump:getPackageBumps: b |> a (should always bump dependents)', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
      ],
      {
        shouldAlwaysBumpDependents: true,
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.1.1',
        },
      },
    ],
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
      ],
      {
        shouldAlwaysBumpDependents: true,
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.3',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '~0.1.3',
        },
      },
    ],
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
      ],
      {
        shouldAlwaysBumpDependents: true,
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.2.0',
        },
      },
    ],
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
      ],
      {
        shouldAlwaysBumpDependents: true,
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.2.0',
        },
      },
    ],
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
      ],
      {
        shouldAlwaysBumpDependents: true,
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^1.2.0',
        },
      },
    ],
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'major', value: '' }] },
      ],
      {
        shouldAlwaysBumpDependents: true,
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^2.0.0',
        },
      },
    ],
    '^ major'
  )

  t.end()
})

test('bump:getPackageBumps: b |> a', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.1.1',
        },
      },
    ],
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.3',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
    ],
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.2',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.2.0',
        },
      },
    ],
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.2.0',
        },
      },
    ],
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
    ],
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'major', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^2.0.0',
        },
      },
    ],
    '^ major'
  )

  t.end()
})

test('bump:getPackageBumps: b |> ia', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'minor',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.1.0',
        },
      },
    ],
    'exact version initial'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '~0.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'patch',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.0.1',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '~0.0.1',
        },
      },
    ],
    '~ initial patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '~0.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'minor',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '~0.1.0',
        },
      },
    ],
    '~ initial minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '0.2.3',
            devDependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'minor',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.1.0',
        },
      },
    ],
    '^ initial minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'minor',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.1.0',
        },
      },
    ],
    '^ initial minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'major',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.0.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^1.0.0',
        },
      },
    ],
    '^ initial major'
  )

  t.end()
})

test('bump:getPackageBumps: self + b -> a', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
      },
      [
        { name: 'b', messages: [{ type: 'patch', value: '' }] },
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '0.1.1',
        },
        devDeps: null,
      },
    ],
    'self = deps'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
      },
      [
        { name: 'b', messages: [{ type: 'major', value: '' }] },
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '0.1.1',
        },
        devDeps: null,
      },
    ],
    'self > patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
      },
      [
        { name: 'b', messages: [{ type: 'patch', value: '' }] },
        { name: 'a', messages: [{ type: 'major', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '0.2.0',
        },
        devDeps: null,
      },
    ],
    'self < deps'
  )

  t.end()
})

test('bump:getPackageBumps: self + b -> ia', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.0.0',
            },
          },
        },
      },
      [
        { name: 'b', messages: [{ type: 'patch', value: '' }] },
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'patch',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.0.1',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '0.0.1',
        },
        devDeps: null,
      },
    ],
    'self = deps'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.0.0',
            },
          },
        },
      },
      [
        { name: 'b', messages: [{ type: 'major', value: '' }] },
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'patch',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.0.1',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '0.0.1',
        },
        devDeps: null,
      },
    ],
    'self > patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.0.0',
            },
          },
        },
      },
      [
        { name: 'b', messages: [{ type: 'patch', value: '' }] },
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'major',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.0.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '1.0.0',
        },
        devDeps: null,
      },
    ],
    'self < deps'
  )

  t.end()
})

test('bump:getPackageBumps: b -> a, c -> a', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '0.1.1',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.3.5',
        type: 'patch',
        deps: {
          a: '0.1.1',
        },
        devDeps: null,
      },
    ],
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '0.1.1',
        },
        devDeps: null,
      },
    ],
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '0.2.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: {
          a: '^0.2.0',
        },
        devDeps: null,
      },
    ],
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '0.2.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: {
          a: '^0.2.0',
        },
        devDeps: null,
      },
    ],
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.2.3',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '1.2.3',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '3.4.5',
            dependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.3.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.4.0',
        type: 'minor',
        deps: {
          a: '1.3.0',
        },
        devDeps: null,
      },
    ],
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.2.3',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '1.2.3',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '3.4.5',
            dependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'major', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '3.0.0',
        type: 'major',
        deps: {
          a: '2.0.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '4.0.0',
        type: 'major',
        deps: {
          a: '^2.0.0',
        },
        devDeps: null,
      },
    ],
    '^ major'
  )

  t.end()
})

test('bump:getPackageBumps: b |> a, c |> a', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.1.1',
        },
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.1.1',
        },
      },
    ],
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.1.1',
        },
      },
    ],
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.2.0',
        },
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.2.0',
        },
      },
    ],
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.2.0',
        },
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.2.0',
        },
      },
    ],
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.2.3',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '2.3.4',
            devDependencies: {
              '@ns/a': '1.2.3',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '3.4.5',
            devDependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.3.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '1.3.0',
        },
      },
    ],
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.2.3',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '2.3.4',
            devDependencies: {
              '@ns/a': '1.2.3',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '3.4.5',
            devDependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'major', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '2.0.0',
        },
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^2.0.0',
        },
      },
    ],
    '^ major'
  )

  t.end()
})

test('bump:getPackageBumps: c -> b -> a', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '0.1.1',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.3.5',
        type: 'patch',
        deps: {
          b: '1.2.4',
        },
        devDeps: null,
      },
    ],
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
            auto: {
              bump: {
                shouldAlwaysBumpDependents: true,
              },
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '~1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.2',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '~0.1.2',
        },
        devDeps: null,
      },
    ],
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '~1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '^0.2.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: {
          b: '^1.3.0',
        },
        devDeps: null,
      },
    ],
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '^1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '^0.2.0',
        },
        devDeps: null,
      },
    ],
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.1',
            auto: {
              bump: {
                shouldAlwaysBumpDependents: true,
              },
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '^1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '^1.2.0',
        },
        devDeps: null,
      },
    ],
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '^1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'major', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '^0.2.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '3.0.0',
        type: 'major',
        deps: {
          b: '^2.0.0',
        },
        devDeps: null,
      },
    ],
    '^ major'
  )

  t.end()
})

test('bump:getPackageBumps: c -> b -> ia', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.0.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'patch',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.0.1',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '0.0.1',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.3.5',
        type: 'patch',
        deps: {
          b: '1.2.4',
        },
        devDeps: null,
      },
    ],
    'exact version initial patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.0.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'patch',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.0.1',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '~0.0.1',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.3.5',
        type: 'patch',
        deps: {
          b: '1.2.4',
        },
        devDeps: null,
      },
    ],
    '~ initial patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '~0.0.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'minor',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '~0.1.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: {
          b: '1.3.0',
        },
        devDeps: null,
      },
    ],
    '~ initial minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '0.2.3',
            dependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '0.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'minor',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '0.3.0',
        type: 'minor',
        deps: {
          a: '^0.1.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: {
          b: '0.3.0',
        },
        devDeps: null,
      },
    ],
    '^ initial minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'minor',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '^0.1.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: {
          b: '1.3.0',
        },
        devDeps: null,
      },
    ],
    '^ initial minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'major',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.0.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '^1.0.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '3.0.0',
        type: 'major',
        deps: {
          b: '2.0.0',
        },
        devDeps: null,
      },
    ],
    '^ initial major'
  )

  t.end()
})

test('bump:getPackageBumps: C |> b |> a', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.1.1',
        },
      },
    ],
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.2',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
    ],
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '~0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.2.0',
        },
      },
    ],
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.2.0',
        },
      },
    ],
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '1.1.1',
            auto: {
              bump: {
                shouldAlwaysBumpDependents: true,
              },
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^1.0.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^1.2.0',
        },
      },
    ],
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.1',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'major', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.2.0',
        },
      },
    ],
    '^ major'
  )

  t.end()
})

test('bump:getPackageBumps: C |> b |> ia', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.0.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'patch',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.0.1',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.0.1',
        },
      },
    ],
    'exact version initial'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '~0.0.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'patch',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.0.1',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '~0.0.1',
        },
      },
    ],
    '~ initial patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '~0.0.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'minor',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '~0.1.0',
        },
      },
    ],
    '~ initial minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '0.2.3',
            devDependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '0.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'minor',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.1.0',
        },
      },
    ],
    '^ initial minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'minor',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.1.0',
        },
      },
    ],
    '^ initial minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '^0.0.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'major',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '1.0.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^1.0.0',
        },
      },
    ],
    '^ initial major'
  )

  t.end()
})

test('bump:getPackageBumps: c -> b -> a -> c', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            dependencies: {
              '@ns/c': '2.3.4',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: {
          c: '2.3.5',
        },
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '0.1.1',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.3.5',
        type: 'patch',
        deps: {
          b: '1.2.4',
        },
        devDeps: null,
      },
    ],
    'a patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            dependencies: {
              '@ns/c': '2.3.4',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
        { name: 'b', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: {
          c: '2.4.0',
        },
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '0.2.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: {
          b: '1.3.0',
        },
        devDeps: null,
      },
    ],
    'a patch + b minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            dependencies: {
              '@ns/c': '2.3.4',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
        { name: 'b', messages: [{ type: 'patch', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: {
          c: '2.4.0',
        },
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '0.2.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: {
          b: '1.3.0',
        },
        devDeps: null,
      },
    ],
    'a minor + b patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            dependencies: {
              '@ns/c': '0.3.4',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '0.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
            auto: {
              bump: {
                zeroBreakingChangeType: 'patch',
              },
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
        { name: 'b', messages: [{ type: 'major', value: '' }] },
        { name: 'c', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'major',
        deps: {
          c: '0.3.5',
        },
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '0.2.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '0.3.5',
        type: 'major',
        deps: {
          b: '2.0.0',
        },
        devDeps: null,
      },
    ],
    'a patch + b major + c minor'
  )

  t.end()
})

test('bump:getPackageBumps: self + c -> b -> ia -> c', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
            dependencies: {
              '@ns/c': '2.3.4',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.0.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'c', messages: [{ type: 'minor', value: '' }] },
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'patch',
      }
    ),
    [
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: {
          b: '1.2.4',
        },
        devDeps: null,
      },
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.0.1',
        type: 'initial',
        deps: {
          c: '2.4.0',
        },
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '0.0.1',
        },
        devDeps: null,
      },
    ],
    'minor c, a initial patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
            dependencies: {
              '@ns/c': '2.3.4',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.0.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
        { name: 'b', messages: [{ type: 'minor', value: '' }] },
      ],
      {
        initialType: 'patch',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.0.1',
        type: 'initial',
        deps: {
          c: '2.4.0',
        },
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '0.0.1',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: {
          b: '1.3.0',
        },
        devDeps: null,
      },
    ],
    'a initial patch + b minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
            dependencies: {
              '@ns/c': '2.3.4',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.0.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
        { name: 'b', messages: [{ type: 'patch', value: '' }] },
      ],
      {
        initialType: 'minor',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.0',
        type: 'initial',
        deps: {
          c: '2.4.0',
        },
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '0.1.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: {
          b: '1.3.0',
        },
        devDeps: null,
      },
    ],
    'a initial minor + b patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
            dependencies: {
              '@ns/c': '2.3.4',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            dependencies: {
              '@ns/a': '0.0.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
        { name: 'b', messages: [{ type: 'major', value: '' }] },
        { name: 'c', messages: [{ type: 'patch', value: '' }] },
        { name: 'c', messages: [{ type: 'minor', value: '' }] },
        { name: 'c', messages: [{ type: 'patch', value: '' }] },
      ],
      {
        initialType: 'patch',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.0.1',
        type: 'initial',
        deps: {
          c: '3.0.0',
        },
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '0.0.1',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '3.0.0',
        type: 'major',
        deps: {
          b: '2.0.0',
        },
        devDeps: null,
      },
    ],
    'a initial patch + b major + c minor'
  )

  t.end()
})

test('bump:getPackageBumps: c |> b |> a |> c', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            devDependencies: {
              '@ns/c': '2.3.4',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.1.1',
        },
      },
    ],
    'a patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            devDependencies: {
              '@ns/c': '2.3.4',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
        { name: 'b', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: null,
        devDeps: {
          a: '0.1.1',
        },
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          b: '1.3.0',
        },
      },
    ],
    'a patch + b minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            devDependencies: {
              '@ns/c': '2.3.4',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
        { name: 'b', messages: [{ type: 'patch', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: null,
        devDeps: {
          a: '0.2.0',
        },
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          b: '1.2.4',
        },
      },
    ],
    'a minor + b patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
            devDependencies: {
              '@ns/c': '2.3.4',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.1.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
        { name: 'b', messages: [{ type: 'major', value: '' }] },
        { name: 'c', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: {
          c: '2.4.0',
        },
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: {
          a: '0.1.1',
        },
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: null,
        devDeps: {
          b: '2.0.0',
        },
      },
    ],
    'a patch + b major + c minor'
  )

  t.end()
})

test('bump:getPackageBumps: c |> b |> ia |> c', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
            devDependencies: {
              '@ns/c': '2.3.4',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.0.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
      ],
      {
        initialType: 'patch',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.0.1',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.0.1',
        },
      },
    ],
    'a initial patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
            devDependencies: {
              '@ns/c': '2.3.4',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.0.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
        { name: 'b', messages: [{ type: 'minor', value: '' }] },
      ],
      {
        initialType: 'patch',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.0.1',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: null,
        devDeps: {
          a: '0.0.1',
        },
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          b: '1.3.0',
        },
      },
    ],
    'a initial patch + b minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
            devDependencies: {
              '@ns/c': '2.3.4',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.0.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
        { name: 'b', messages: [{ type: 'patch', value: '' }] },
      ],
      {
        initialType: 'minor',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.0',
        type: 'initial',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.2.4',
        type: 'patch',
        deps: null,
        devDeps: {
          a: '0.1.0',
        },
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          b: '1.2.4',
        },
      },
    ],
    'a initial minor + b patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
            devDependencies: {
              '@ns/c': '2.3.4',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
            devDependencies: {
              '@ns/a': '0.0.0',
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
        { name: 'b', messages: [{ type: 'major', value: '' }] },
        { name: 'c', messages: [{ type: 'minor', value: '' }] },
      ],
      {
        initialType: 'patch',
      }
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.0.1',
        type: 'initial',
        deps: null,
        devDeps: {
          c: '2.4.0',
        },
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: {
          a: '0.0.1',
        },
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: null,
        devDeps: {
          b: '2.0.0',
        },
      },
    ],
    'a initial patch + b major + c minor'
  )

  t.end()
})

test('bump:getPackageBumps: c |> b, c -> a (should always bump dependents)', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '0.1.0',
            },
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
        { name: 'b', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.3.5',
        type: 'patch',
        deps: {
          a: '0.1.1',
        },
        devDeps: {
          b: '1.3.0',
        },
      },
    ],
    'a patch + b minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '0.1.0',
            },
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
        { name: 'b', messages: [{ type: 'major', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: {
          a: '0.2.0',
        },
        devDeps: {
          b: '2.0.0',
        },
      },
    ],
    'a minor + b major'
  )

  t.end()
})

test('bump:getPackageBumps: c |> b, c -> a', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '0.1.0',
            },
            devDependencies: {
              '@ns/b': '^1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'patch', value: '' }] },
        { name: 'b', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '1.3.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.3.5',
        type: 'patch',
        deps: {
          a: '0.1.1',
        },
        devDeps: null,
      },
    ],
    'a patch + b minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '^0.1.0',
            },
            devDependencies: {
              '@ns/b': '^1.2.3',
            },
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
        { name: 'b', messages: [{ type: 'major', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: {
          a: '^0.2.0',
        },
        devDeps: {
          b: '^2.0.0',
        },
      },
    ],
    'a minor + b major'
  )

  t.end()
})

test('bump:getPackageBumps: throw', (t) => {
  t.throws(
    () => getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
      },
      [
        { name: 'b', messages: [{ type: 'minor', value: '' }] },
      ]
    ),
    /Unable to find package/,
    'not existing package'
  )

  t.end()
})

test('bump:getPackageBumps: sort', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '2.3.4',
            dependencies: {
              '@ns/a': '0.1.0',
            },
            devDependencies: {
              '@ns/b': '1.2.3',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '1.2.3',
          },
        },
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.1.0',
          },
        },
      },
      [
        { name: 'a', messages: [{ type: 'minor', value: '' }] },
        { name: 'b', messages: [{ type: 'major', value: '' }] },
      ]
    ),
    [
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null,
      },
      {
        name: 'b',
        dir: '/fakes/b',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '2.4.0',
        type: 'minor',
        deps: {
          a: '0.2.0',
        },
        devDeps: {
          b: '2.0.0',
        },
      },
    ],
    'should sort'
  )

  t.end()
})

test('bump:getPackageBumps: c -> ib -> ia -> c', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          dir: '/fakes/a',
          json: {
            name: '@ns/a',
            version: '0.0.0',
            dependencies: {
              '@ns/c': '1.2.3',
            },
          },
        },
        b: {
          dir: '/fakes/b',
          json: {
            name: '@ns/b',
            version: '0.0.0',
            dependencies: {
              '@ns/a': '0.0.0',
            },
            auto: {
              bump: {
                initialType: 'minor',
              },
            },
          },
        },
        c: {
          dir: '/fakes/c',
          json: {
            name: '@ns/c',
            version: '0.2.3',
            dependencies: {
              '@ns/b': '0.0.0',
            },
            auto: {
              bump: {
                zeroBreakingChangeType: 'major',
              },
            },
          },
        },
      },
      [
        { name: 'b', messages: [{ type: 'initial', value: '' }] },
        { name: 'a', messages: [{ type: 'initial', value: '' }] },
        { name: 'c', messages: [{ type: 'major', value: '' }] },
      ],
      {
        initialType: 'patch',
      }
    ),
    [
      {
        name: 'b',
        dir: '/fakes/b',
        version: '0.1.0',
        type: 'initial',
        deps: {
          a: '0.0.1',
        },
        devDeps: null,
      },
      {
        name: 'a',
        dir: '/fakes/a',
        version: '0.0.1',
        type: 'initial',
        deps: {
          c: '1.0.0',
        },
        devDeps: null,
      },
      {
        name: 'c',
        dir: '/fakes/c',
        version: '1.0.0',
        type: 'major',
        deps: {
          b: '0.1.0',
        },
        devDeps: null,
      },
    ],
    'initial a, initial b, c major'
  )

  t.end()
})
