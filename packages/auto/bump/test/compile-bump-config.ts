import test from 'blue-tape'
import { TResolvedBumpType } from '@auto/utils'
import { compileBumpConfig } from '../src/compile-bump-config'

test('compile-auto-config', (t) => {
  t.deepEquals(
    compileBumpConfig(),
    {
      initialType: 'minor',
      zeroBreakingChangeType: 'minor',
      shouldAlwaysBumpDependents: false,
    },
    'default config'
  )

  t.deepEquals(
    compileBumpConfig({
      initialType: 'patch',
      zeroBreakingChangeType: 'major',
      shouldAlwaysBumpDependents: true,
    }),
    {
      initialType: 'patch',
      zeroBreakingChangeType: 'major',
      shouldAlwaysBumpDependents: true,
    },
    'root config'
  )

  t.deepEquals(
    compileBumpConfig({
      initialType: 'patch',
      zeroBreakingChangeType: 'major',
      shouldAlwaysBumpDependents: true,
    }, {
      initialType: 'major',
      zeroBreakingChangeType: 'patch',
      shouldAlwaysBumpDependents: false,
    }),
    {
      initialType: 'major',
      zeroBreakingChangeType: 'patch',
      shouldAlwaysBumpDependents: false,
    },
    'local config'
  )

  t.throws(() => {
    compileBumpConfig({
      initialType: 'initial' as TResolvedBumpType,
    })
  }, /Incorrect initialType/)

  t.throws(() => {
    compileBumpConfig({
      initialType: 'patch',
    }, {
      initialType: '' as TResolvedBumpType,
    })
  }, /Incorrect initialType/)

  t.throws(() => {
    compileBumpConfig({
      zeroBreakingChangeType: 'initial' as TResolvedBumpType,
    })
  }, /Incorrect zeroBreakingChangeType/)

  t.throws(() => {
    compileBumpConfig({
      zeroBreakingChangeType: 'minor',
    }, {
      zeroBreakingChangeType: 'initial' as TResolvedBumpType,
    })
  }, /Incorrect zeroBreakingChangeType/)

  t.end()
})
