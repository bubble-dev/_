import test from 'blue-tape'
import { mock } from 'mocku'
import { TGitBump, TPackages } from '@auto/utils/src/types'
import { prefixes } from '@auto/utils/test/prefixes'

const packages: TPackages = {
  foo: {
    dir: 'fakes/foo',
    json: {
      name: 'foo',
      version: '0.1.2',
    },
  },
  bar: {
    dir: 'fakes/bar',
    json: {
      name: 'bar',
      version: '2.1.0',
    },
  },
  baz: {
    dir: 'fakes/baz',
    json: {
      name: 'baz',
      version: '0.0.0',
    },
  },
}

test('git:getBumps single package', async (t) => {
  const unmock = mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.patch.value} foo: patch 2\n\ndescription`,
        `${prefixes.required.patch.value} foo: patch 1\n\ndescription`,
        `${prefixes.required.publish.value} foo: v1.2.3\n\ndescription`,
        `${prefixes.required.initial.value} foo: initial\n\ndescription`,
      ]),
    },
  })

  const { getBumps } = await import('../src/get-bumps')

  const expectedResult: TGitBump[] = [{
    name: 'foo',
    messages: [{
      type: 'patch',
      value: 'patch 2',
      description: 'description',
    }, {
      type: 'patch',
      value: 'patch 1',
      description: 'description',
    }],
  }]

  t.deepEquals(
    await getBumps(packages, prefixes),
    expectedResult,
    'bump as patch + patch'
  )

  unmock()
})

test('git:getBumps single package', async (t) => {
  const unmock = mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.minor.value} foo: minor`,
        `${prefixes.required.patch.value} foo: patch`,
        `${prefixes.required.publish.value} foo: v1.2.3`,
        `${prefixes.required.initial.value} foo: initial`,
      ]),
    },
  })

  const { getBumps } = await import('../src/get-bumps')

  const expectedResult: TGitBump[] = [{
    name: 'foo',
    messages: [{
      type: 'minor',
      value: 'minor',
      description: undefined,
    }, {
      type: 'patch',
      value: 'patch',
      description: undefined,
    }],
  }]

  t.deepEquals(
    await getBumps(packages, prefixes),
    expectedResult,
    'bump as patch + minor'
  )

  unmock()
})

test('git:getBumps single package', async (t) => {
  const unmock = mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.patch.value} foo: patch`,
        `${prefixes.required.minor.value} foo: minor`,
        `${prefixes.required.publish.value} foo: v1.2.3`,
        `${prefixes.required.initial.value} foo: initial`,
      ]),
    },
  })

  const { getBumps } = await import('../src/get-bumps')

  const expectedResult: TGitBump[] = [{
    name: 'foo',
    messages: [{
      type: 'patch',
      value: 'patch',
      description: undefined,
    }, {
      type: 'minor',
      value: 'minor',
      description: undefined,
    }],
  }]

  t.deepEquals(
    await getBumps(packages, prefixes),
    expectedResult,
    'bump as minor + patch'
  )

  unmock()
})

test('git:getBumps single package', async (t) => {
  const unmock = mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.major.value} foo: major`,
        `${prefixes.required.minor.value} foo: minor`,
        `${prefixes.required.patch.value} foo: patch`,
        `${prefixes.required.publish.value} foo: v1.2.3`,
        `${prefixes.required.initial.value} foo: initial`,
      ]),
    },
  })

  const { getBumps } = await import('../src/get-bumps')

  const expectedResult: TGitBump[] = [{
    name: 'foo',
    messages: [{
      type: 'major',
      value: 'major',
      description: undefined,
    }, {
      type: 'minor',
      value: 'minor',
      description: undefined,
    }, {
      type: 'patch',
      value: 'patch',
      description: undefined,
    }],
  }]

  t.deepEquals(
    await getBumps(packages, prefixes),
    expectedResult,
    'bump as patch + minor + major'
  )

  unmock()
})

test('git:getBumps single package', async (t) => {
  const unmock = mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.minor.value} foo: minor`,
        `${prefixes.required.major.value} foo: major`,
        `${prefixes.required.patch.value} foo: patch`,
        `${prefixes.required.publish.value} foo: v1.2.3`,
        `${prefixes.required.initial.value} foo: initial`,
      ]),
    },
  })

  const { getBumps } = await import('../src/get-bumps')

  const expectedResult: TGitBump[] = [{
    name: 'foo',
    messages: [{
      type: 'minor',
      value: 'minor',
      description: undefined,

    }, {
      type: 'major',
      value: 'major',
      description: undefined,
    }, {
      type: 'patch',
      value: 'patch',
      description: undefined,
    }],
  }]

  t.deepEquals(
    await getBumps(packages, prefixes),
    expectedResult,
    'bump as patch + major + minor'
  )

  unmock()
})

test('git:getBumps single package', async (t) => {
  const unmock = mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.minor.value} foo: minor`,
        `${prefixes.required.patch.value} foo: patch`,
        `${prefixes.required.major.value} foo: major`,
        `${prefixes.required.publish.value} foo: v1.2.3`,
        `${prefixes.required.initial.value} foo: initial`,
      ]),
    },
  })

  const { getBumps } = await import('../src/get-bumps')

  const expectedResult: TGitBump[] = [{
    name: 'foo',
    messages: [{
      type: 'minor',
      value: 'minor',
      description: undefined,
    }, {
      type: 'patch',
      value: 'patch',
      description: undefined,
    }, {
      type: 'major',
      value: 'major',
      description: undefined,
    }],
  }]

  t.deepEquals(
    await getBumps(packages, prefixes),
    expectedResult,
    'bump as major + patch + minor'
  )

  unmock()
})

test('git:getBumps multiple packages', async (t) => {
  const unmock = mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.patch.value} foo: patch`,
        `${prefixes.required.publish.value} foo: v1.0.1`,
        `${prefixes.required.major.value} foo: breaking`,
        `${prefixes.required.patch.value} bar: patch`,
        `${prefixes.required.publish.value} bar: v2.0.1`,
        `${prefixes.required.major.value} bar: breaking`,
        `${prefixes.required.initial.value} foo: initial`,
        `${prefixes.required.initial.value} bar: initial`,
      ]),
    },
  })

  const { getBumps } = await import('../src/get-bumps')

  const expectedResult: TGitBump[] = [{
    name: 'foo',
    messages: [{
      type: 'patch',
      value: 'patch',
      description: undefined,
    }],
  }, {
    name: 'bar',
    messages: [{
      type: 'patch',
      value: 'patch',
      description: undefined,
    }],
  }]

  t.deepEquals(
    await getBumps(packages, prefixes),
    expectedResult,
    'bump as patch && patch'
  )

  unmock()
})

test('git:getBumps multiple packages in one commit', async (t) => {
  const unmock = mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.patch.value} foo: patch`,
        `${prefixes.required.major.value} foo: breaking`,
        `${prefixes.required.patch.value} bar: patch`,
        `${prefixes.required.publish.value} foo, bar: release`,
        `${prefixes.required.major.value} bar: breaking`,
        `${prefixes.required.initial.value} foo: initial`,
        `${prefixes.required.initial.value} bar: initial`,
      ]),
    },
  })

  const { getBumps } = await import('../src/get-bumps')

  const expectedResult: TGitBump[] = [{
    name: 'foo',
    messages: [{
      type: 'patch',
      value: 'patch',
      description: undefined,
    }, {
      type: 'major',
      value: 'breaking',
      description: undefined,
    }],
  }, {
    name: 'bar',
    messages: [{
      type: 'patch',
      value: 'patch',
      description: undefined,
    }],
  }]

  t.deepEquals(
    await getBumps(packages, prefixes),
    expectedResult,
    'bump as major && patch'
  )

  unmock()
})

test('git:getBumps star symbol', async (t) => {
  const unmock = mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.minor.value} *: minor`,
        `${prefixes.required.patch.value} foo: patch`,
        `${prefixes.required.patch.value} bar: patch`,
      ]),
    },
  })

  const { getBumps } = await import('../src/get-bumps')

  const expectedResult: TGitBump[] = [{
    name: 'foo',
    messages: [
      {
        type: 'minor',
        value: 'minor',
        description: undefined,
      },
      {
        type: 'patch',
        value: 'patch',
        description: undefined,
      },
    ],
  }, {
    name: 'bar',
    messages: [
      {
        type: 'minor',
        value: 'minor',
        description: undefined,
      },
      {
        type: 'patch',
        value: 'patch',
        description: undefined,
      },
    ],
  }, {
    name: 'baz',
    messages: [
      {
        type: 'minor',
        value: 'minor',
        description: undefined,
      },
    ],
  }]

  t.deepEquals(
    await getBumps(packages, prefixes),
    expectedResult,
    'bump as minor && minor'
  )

  unmock()
})

test('git:getBumps string + star symbol', async (t) => {
  const unmock = mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.minor.value} ba*: minor`,
        `${prefixes.required.patch.value} foo: patch\n\ndescription`,
      ]),
    },
  })

  const { getBumps } = await import('../src/get-bumps')

  const expectedResult: TGitBump[] = [{
    name: 'bar',
    messages: [
      {
        type: 'minor',
        value: 'minor',
        description: undefined,
      },
    ],
  }, {
    name: 'baz',
    messages: [
      {
        type: 'minor',
        value: 'minor',
        description: undefined,
      },
    ],
  }, {
    name: 'foo',
    messages: [
      {
        type: 'patch',
        value: 'patch',
        description: 'description',
      },
    ],
  }]

  t.deepEquals(
    await getBumps(packages, prefixes),
    expectedResult,
    'bump as minor && minor'
  )

  unmock()
})

test('git:getBumps skipped commits', async (t) => {
  const unmock = mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.minor.value} foo: minor`,
        `${prefixes.required.minor.value} foo`,
        `${prefixes.required.major.value}`,
        'beep',
        `${prefixes.required.dependencies.value} foo: upgrade dependencies`,
        `${prefixes.required.patch.value} foo: patch`,
        `${prefixes.required.patch.value} NonExistingPackage: patch`,
        `${prefixes.required.publish.value} foo: v1.0.1`,
      ]),
    },
  })

  const { getBumps } = await import('../src/get-bumps')

  const expectedResult: TGitBump[] = [{
    name: 'foo',
    messages: [{
      type: 'minor',
      value: 'minor',
      description: undefined,
    }, {
      type: 'patch',
      value: 'patch',
      description: undefined,
    }],
  }]

  t.deepEquals(
    await getBumps(packages, prefixes),
    expectedResult,
    'skip invalid commit messages'
  )

  unmock()
})

test('git:getBumps multiple packages initial', async (t) => {
  const unmock = mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${prefixes.required.patch.value} foo: patch`,
        `${prefixes.required.major.value} foo: breaking`,
        `${prefixes.required.patch.value} bar: patch`,
        `${prefixes.required.initial.value} baz: initial`,
        `${prefixes.required.publish.value} bar: v2.0.1`,
        `${prefixes.required.major.value} bar: breaking`,
        `${prefixes.required.initial.value} foo: initial`,
        `${prefixes.required.minor.value} foo: minor`,
        `${prefixes.required.initial.value} bar: initial`,
      ]),
    },
  })

  const { getBumps } = await import('../src/get-bumps')

  const expectedResult: TGitBump[] = [{
    name: 'foo',
    messages: [{
      type: 'initial',
      value: 'initial',
      description: undefined,
    }],
  }, {
    name: 'bar',
    messages: [{
      type: 'patch',
      value: 'patch',
      description: undefined,
    }],
  }, {
    name: 'baz',
    messages: [{
      type: 'initial',
      value: 'initial',
      description: undefined,
    }],
  }]

  t.deepEquals(
    await getBumps(packages, prefixes),
    expectedResult,
    'bump as patch && patch'
  )

  unmock()
})
