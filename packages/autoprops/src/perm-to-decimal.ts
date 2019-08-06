import BigInt, { BigInteger } from 'big-integer'
import { PermutationDecimal } from './types'

export const permToDecimal = (values: BigInteger[], length: BigInteger[]): PermutationDecimal => {
  let result: PermutationDecimal = BigInt.zero
  let multipliedLength = BigInt.one

  for (let i = 0; i < values.length; ++i) {
    if (i > 0) {
      multipliedLength = multipliedLength.multiply(length[i - 1])
    }

    result = result.add(multipliedLength.multiply(values[i]))
  }

  return result
}
