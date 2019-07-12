import test from 'blue-tape'
import { getPositionInMasked, getPositionInValue } from '..'

test('getPositionInMasked', (t) => {
  t.equals(
    getPositionInMasked(
      '20192',
      [null, null, null, null, '-', null, null, '-', null, null],
      4
    ),
    5,
    'should be 5'
  )
  t.equals(
    getPositionInMasked(
      '20192',
      [null, null, null, null, '-', null, null, '-', null, null],
      3
    ),
    3,
    'should be 3'
  )
  t.equals(
    getPositionInMasked(
      '2019-2',
      [null, null, null, null, '-', null, null, '-', null, null],
      5
    ),
    5,
    'should be 5'
  )
  t.equals(
    getPositionInMasked(
      '020',
      [null],
      0
    ),
    0,
    'should be 0'
  )
  t.equals(
    getPositionInMasked(
      '020',
      ['-', null],
      0
    ),
    1,
    'should be 1'
  )
  t.equals(
    getPositionInMasked(
      '-020',
      ['-', null],
      0
    ),
    0,
    'should be 0'
  )
  t.equals(
    getPositionInMasked(
      '',
      ['-', null],
      0
    ),
    1,
    'should be 1'
  )

  t.throws(
    () => getPositionInMasked(
      '12',
      [],
      0
    ),
    /Position is out of bounds of the mask/,
    'should fail'
  )

  t.end()
})

test('getPositionInValue', (t) => {
  t.equals(
    getPositionInValue(
      '20192',
      [null, null, null, null, '-', null, null, '-', null, null],
      5
    ),
    4,
    'should be 4'
  )
  t.equals(
    getPositionInValue(
      '20192',
      [null, null, null, null, '-', null, null, '-', null, null],
      3
    ),
    3,
    'should be 3'
  )
  t.equals(
    getPositionInValue(
      'va',
      [],
      0
    ),
    0,
    'should be 0'
  )
  t.equals(
    getPositionInValue(
      'va',
      [null],
      0
    ),
    0,
    'should be 0'
  )
  t.equals(
    getPositionInValue(
      '-va',
      ['-', null],
      0
    ),
    0,
    'should be 0'
  )
  t.equals(
    getPositionInValue(
      'va',
      ['-', null],
      0
    ),
    0,
    'should be 0'
  )
  t.equals(
    getPositionInValue(
      'va',
      ['-', null],
      1
    ),
    0,
    'should be 0'
  )
  t.equals(
    getPositionInValue(
      'va',
      [null],
      1
    ),
    1,
    'should be 1'
  )
  t.equals(
    getPositionInValue(
      '-va',
      ['-', null],
      1
    ),
    1,
    'should be 1'
  )
  t.equals(
    getPositionInValue(
      '2019-2',
      [null, null, null, null, '-', null, null, '-', null, null],
      5
    ),
    5,
    'should be 5'
  )

  t.end()
})
