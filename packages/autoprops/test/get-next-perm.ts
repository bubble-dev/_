import test from 'blue-tape'
import BigInt from 'big-integer'
import { TMetaFile } from '../src/types'
import { getNextPerm } from '../src/get-next-perm'

test('getNextPerm: simple case', (t) => {
  const meta: TMetaFile = {
    config: {
      props: {
        a: [true],
        b: [true],
      },
    },
    Component: () => null,
  }

  const decimals = [BigInt(0), BigInt(1), BigInt(2), BigInt(3)]
  const expected = [BigInt(1), BigInt(2), BigInt(3), null]

  t.true(
    decimals
      .map((value) => getNextPerm(value, meta))
      .every((val, i) => (val === null ? val === expected[i] : val.equals(expected[i]!))),
    'should return next perm'
  )

  t.end()
})

test('getNextPerm: props mutex', (t) => {
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

  const decimals = [BigInt(0), BigInt(1), BigInt(2), BigInt(3), BigInt(4), BigInt(5), BigInt(6), BigInt(7)]
  const expected = [BigInt(1), BigInt(2), BigInt(4), BigInt(4), BigInt(6), BigInt(6), null, null]

  t.true(
    decimals
      .map((value) => getNextPerm(value, meta))
      .every((val, i) => (val === null || expected[i] === null ? val === expected[i] : val.equals(expected[i]!))),
    'should return next perm'
  )

  t.end()
})

test('getNextPerm: props mutin', (t) => {
  const meta: TMetaFile = {
    config: {
      props: {
        a: [true],
        b: [true],
        c: [true],
      },
      mutin: [
        ['a', 'c'],
      ],
    },
    Component: () => null,
  }

  const decimals = [BigInt(0), BigInt(1), BigInt(2), BigInt(3), BigInt(4), BigInt(5), BigInt(6), BigInt(7)]
  const expected = [BigInt(2), BigInt(2), BigInt(5), BigInt(5), BigInt(5), BigInt(7), BigInt(7), null]

  t.true(
    decimals
      .map((value) => getNextPerm(value, meta))
      .every((val, i) => (val === null || expected[i] === null ? val === expected[i] : val.equals(expected[i]!))),
    'should return next perm'
  )

  t.end()
})

test('getNextPerm: children', (t) => {
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
            props: {},
          },
          Component: () => null,
        },
        child2: {
          config: {
            props: {},
          },
          Component: () => null,
        },
      },
      children: ['child', 'child2'],
      required: ['child'],
    },
    Component: () => null,
  }

  const decimals = [BigInt(0), BigInt(1), BigInt(2), BigInt(3)]
  const expected = [BigInt(1), BigInt(2), BigInt(3), null]

  t.true(
    decimals
      .map((value) => getNextPerm(value, meta))
      .every((val, i) => (val === null || expected[i] === null ? val === expected[i] : val.equals(expected[i]!))),
    'should return next perm'
  )

  t.end()
})

