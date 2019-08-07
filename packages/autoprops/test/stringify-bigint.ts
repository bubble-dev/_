import test from 'blue-tape'
import BigInt from 'big-integer'
import { stringifyBigInt } from '../src/stringify-bigint'

test('stringifyBigInt', (t) => {
  t.equals(
    stringifyBigInt(BigInt(Number.MAX_SAFE_INTEGER)),
    'jLPPD2sEv',
    'should stringify'
  )

  t.end()
})
