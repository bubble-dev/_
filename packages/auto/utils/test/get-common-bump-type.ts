import test from 'blue-tape'
import { getCommonBumpType } from '../src/get-common-bump-type'

test('get-common-bump-type', (t) => {
  t.equals(
    getCommonBumpType({
      name: 'a',
      messages: [
        { type: 'patch', value: '' },
        { type: 'patch', value: '' },
      ],
    }),
    'patch',
    'single type'
  )

  t.equals(
    getCommonBumpType({
      name: 'a',
      messages: [
        { type: 'minor', value: '' },
        { type: 'patch', value: '' },
        { type: 'major', value: '' },
      ],
    }),
    'major',
    'multiple types'
  )

  t.equals(
    getCommonBumpType({
      name: 'a',
      messages: [
        { type: 'major', value: '' },
        { type: 'initial', value: '' },
        { type: 'patch', value: '' },
      ],
    }),
    'initial',
    'initial is most significant'
  )

  t.throws(
    () => {
      getCommonBumpType({
        name: 'a',
        messages: [],
      })
    },
    /common bump type/
  )

  t.end()
})
