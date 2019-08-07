/* eslint-disable no-use-before-define */
import { isUndefined } from 'tsfn'
import BigInt, { BigInteger } from 'big-integer'
import { TMetaFile } from './types'
import { packPerm } from './pack-perm'
import { unpackPerm } from './unpack-perm'
import { parseBigInt } from './parse-bigint'
import { stringifyBigInt } from './stringify-bigint'
import { checkRestriction, RESTRICTION_MUTEX, RESTRICTION_MUTIN } from './check-restriction'
import { getNumSkipMutex } from './get-num-skip-mutex'

const getChildNextPerm = (decimal: BigInteger, childMeta: TMetaFile, childKey: string, required?: string[]): BigInteger | null => {
  if (!isUndefined(required) && required.includes(childKey)) {
    return getNextPermImpl(decimal, childMeta)
  } else if (decimal.greater(BigInt.zero)) {
    return getNextPermImpl(decimal.minus(BigInt.one), childMeta)
  }

  return decimal.plus(BigInt.one)
}

export const getNextPermImpl = (decimal: BigInteger, metaFile: TMetaFile): BigInteger | null => {
  const propsKeys = Object.keys(metaFile.config.props)
  const { values, length } = unpackPerm(decimal, metaFile)

  if (values.length === 0) {
    return null
  }

  let i = 0

  for (; i < values.length; ++i) {
    // increment props or children
    if (i < propsKeys.length) {
      values[i] = values[i].plus(BigInt.one)
    } else {
      const childrenConfig = metaFile.childrenConfig!
      const childKey = childrenConfig.children[i - propsKeys.length]
      const childNextPerm = getChildNextPerm(values[i], childrenConfig.meta[childKey], childKey, childrenConfig.required)

      // handle child value overflow
      values[i] = childNextPerm !== null ? childNextPerm : length[i]
    }

    // if done incrementing
    if (values[i].notEquals(length[i])) {
      break
    }

    // if all digits overflow
    if (i === values.length - 1) {
      return null
    }

    // reset overflow digit
    values[i] = BigInt.zero
  }

  /* check restrictions */
  const restriction = i < propsKeys.length
    ? checkRestriction(values, 0, propsKeys, metaFile.config.mutex, metaFile.config.mutin)
    : checkRestriction(values, propsKeys.length, metaFile.childrenConfig!.children, metaFile.childrenConfig!.mutex, metaFile.childrenConfig!.mutin)

  switch (restriction) {
    case RESTRICTION_MUTEX:
      return getNextPermImpl(decimal.plus(getNumSkipMutex(values, length, i)), metaFile)
    case RESTRICTION_MUTIN:
      return getNextPermImpl(decimal.plus(BigInt.one), metaFile)
  }

  return packPerm(values, length)
}

export const getNextPerm = (intStr: string, metaFile: TMetaFile): string | null => {
  const result = getNextPermImpl(parseBigInt(intStr), metaFile)

  if (result !== null) {
    return stringifyBigInt(result)
  }

  return result
}
