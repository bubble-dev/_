import test from 'blue-tape'
import BigInt from 'big-integer'
import { TMetaFile } from '../src/types'
import { applyPropValue } from '../src'

test('applyPropValue: boolean case', (t) => {
  const meta: TMetaFile = {
    config: {
      props: {
        a: [false, true],
        b: [false, true],
      },
      required: ['b'],
    },
    Component: () => null,
  }

  t.true(
    applyPropValue(BigInt(0), meta, ['a'], true).equals(BigInt(2)),
    'undefined to true'
  )

  t.true(
    applyPropValue(BigInt(2), meta, ['a'], false).equals(BigInt(1)),
    'true to false'
  )

  t.true(
    applyPropValue(BigInt(1), meta, ['a'], undefined).equals(BigInt(0)),
    'false to undefined'
  )

  t.true(
    applyPropValue(BigInt(0), meta, ['b'], true).equals(BigInt(3)),
    'required false to true'
  )

  t.true(
    applyPropValue(BigInt(4), meta, ['b'], false).equals(BigInt(1)),
    'required true to false'
  )

  t.true(
    applyPropValue(BigInt(4), meta, ['b'], undefined).equals(BigInt(1)),
    'required true to undefined'
  )

  t.true(
    applyPropValue(BigInt(4), meta, ['b'], 'incorrect').equals(BigInt(1)),
    'incorrect value'
  )

  t.end()
})

test('applyPropValue: non primitive values', (t) => {
  const meta: TMetaFile = {
    config: {
      props: {
        a: [() => {}, [1, 2], { a: 1 }],
      },
    },
    Component: () => null,
  }

  t.true(
    applyPropValue(BigInt(0), meta, ['a'], meta.config.props.a[0]).equals(BigInt(1)),
    'should find function'
  )

  t.true(
    applyPropValue(BigInt(0), meta, ['a'], meta.config.props.a[1]).equals(BigInt(2)),
    'should find array'
  )

  t.true(
    applyPropValue(BigInt(0), meta, ['a'], meta.config.props.a[2]).equals(BigInt(3)),
    'should find object'
  )

  t.end()
})

test('applyPropValue: prop mutex', (t) => {
  const meta: TMetaFile = {
    config: {
      props: {
        a: [true],
        b: [true],
        c: [true],
      },
      mutex: [
        ['a', 'b'],
        ['a', 'c'],
      ],
    },
    Component: () => null,
  }

  t.true(
    applyPropValue(BigInt(1), meta, ['c'], true).equals(BigInt(4)),
    'disable prop by mutex'
  )

  t.end()
})

test('applyPropValue: prop mutin', (t) => {
  const meta: TMetaFile = {
    config: {
      props: {
        a: [true],
        b: [true],
        c: [true],
      },
      mutin: [
        ['a', 'b'],
        ['b', 'c'],
      ],
    },
    Component: () => null,
  }

  t.true(
    applyPropValue(BigInt(0), meta, ['c'], true).equals(BigInt(7)),
    'enable props by mutin'
  )

  t.true(
    applyPropValue(BigInt(7), meta, ['c'], false).equals(BigInt(0)),
    'disable props by mutin'
  )

  t.end()
})

test('applyPropValue: boolean inside child', (t) => {
  const meta: TMetaFile = {
    config: {
      props: {
        a: [true],
      },
    },
    childrenConfig: {
      meta: {
        child: {
          config: {
            props: {
              a: [true],
            },
          },
          Component: () => null,
        },
      },
      children: ['child'],
    },
    Component: () => null,
  }

  t.true(
    applyPropValue(BigInt(2), meta, ['children', 'child__0', 'a'], true).equals(BigInt(4)),
    'child undefined to true'
  )

  t.true(
    applyPropValue(BigInt(5), meta, ['children', 'child__0', 'a'], false).equals(BigInt(3)),
    'true to false'
  )

  t.true(
    applyPropValue(BigInt(5), meta, ['children', 'child__0', 'a'], undefined).equals(BigInt(3)),
    'false to undefined'
  )

  t.end()
})

test('applyPropPath: enable disable child', (t) => {
  const meta: TMetaFile = {
    config: { props: {} },
    childrenConfig: {
      meta: {
        child: { config: { props: {} }, Component: () => null },
      },
      children: ['child'],
    },
    Component: () => null,
  }

  t.true(
    applyPropValue(BigInt(0), meta, ['children', 'child__0'], {}).equals(BigInt(1)),
    'should enable child'
  )

  t.true(
    applyPropValue(BigInt(1), meta, ['children', 'child__0'], undefined).equals(BigInt(0)),
    'should disable child'
  )

  t.end()
})

test('applyPropPath: child mutins', (t) => {
  const meta: TMetaFile = {
    config: { props: {} },
    childrenConfig: {
      meta: {
        a: { config: { props: {} }, Component: () => null },
        b: { config: { props: {} }, Component: () => null },
        c: { config: { props: {} }, Component: () => null },
      },
      children: ['a', 'b', 'c'],
      mutin: [
        ['a', 'b'],
        ['a', 'c'],
      ],
    },
    Component: () => null,
  }

  t.true(
    applyPropValue(BigInt(0), meta, ['children', 'c__0'], true).equals(BigInt(7)),
    'enable child by mutin'
  )

  t.true(
    applyPropValue(BigInt(7), meta, ['children', 'c__0'], undefined).equals(BigInt(0)),
    'disable child by mutin'
  )

  t.end()
})

test('applyPropPath: child mutexes', (t) => {
  const meta: TMetaFile = {
    config: { props: {} },
    childrenConfig: {
      meta: {
        a: { config: { props: {} }, Component: () => null },
        b: { config: { props: {} }, Component: () => null },
        c: { config: { props: {} }, Component: () => null },
      },
      children: ['a', 'b', 'c'],
      mutex: [
        ['a', 'b'],
        ['a', 'c'],
      ],
    },
    Component: () => null,
  }

  t.true(
    applyPropValue(BigInt(1), meta, ['children', 'c__0'], {}).equals(BigInt(4)),
    'should disable child by mutex'
  )

  t.end()
})

test('applyPropPath: change required child prop', (t) => {
  const meta: TMetaFile = {
    config: {
      props: {},
    },
    childrenConfig: {
      meta: {
        child: {
          config: {
            props: {
              a: [true],
            },
          },
          Component: () => null,
        },
      },
      children: ['child'],
      required: ['child'],
    },
    Component: () => null,
  }

  t.true(
    applyPropValue(BigInt(0), meta, ['children', 'child__0', 'a'], true).equals(BigInt(1)),
    'should enable prop in child'
  )

  t.end()
})

test('applyPropPath: errors', (t) => {
  const meta: TMetaFile = {
    config: {
      props: {
        a: [true],
      },
    },
    childrenConfig: {
      meta: {
        child: {
          config: {
            props: {
              a: [true],
            },
          },
          Component: () => null,
        },
      },
      children: ['child'],
    },
    Component: () => null,
  }

  t.throws(
    () => applyPropValue(BigInt(0), meta, ['children', 'child__0', 'a'], true),
    /was not enabled/,
    'should throw if previous state is not compatible with path'
  )

  t.throws(
    () => applyPropValue(BigInt(0), meta, ['b'], true),
    /could not find prop/,
    'should throw if path is incorrect'
  )

  t.throws(
    () => applyPropValue(BigInt(2), meta, ['children', 'child__0', 'a', 'a'], true),
    /incorrect path/,
    'should throw if children not exist'
  )

  t.end()
})
