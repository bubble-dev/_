/* eslint-disable no-use-before-define */
import { isUndefined } from 'tsfn'
import BigInt from 'big-integer'
import { TMetaFile, PermutationDecimal } from './types'
import { permToDecimal } from './perm-to-decimal'
import { decimalToPerm } from './decimal-to-perm'
import { checkRestriction, RESTRICTION_MUTEX, RESTRICTION_MUTIN } from './check-restriction'
import { getNumSkipMutex } from './get-num-skip-mutex'

const getChildNextPerm = (decimal: PermutationDecimal, childMeta: TMetaFile, childKey: string, required?: string[]): PermutationDecimal | null => {
  if (!isUndefined(required) && required.includes(childKey)) {
    return getNextPerm(decimal, childMeta)
  } else if (decimal.greater(BigInt.zero)) {
    return getNextPerm(decimal.minus(BigInt.one), childMeta)
  }

  return decimal.plus(BigInt.one)
}

export const getNextPerm = (decimal: PermutationDecimal, metaFile: TMetaFile): PermutationDecimal | null => {
  const propsKeys = Object.keys(metaFile.config.props)
  const { values, length } = decimalToPerm(decimal, metaFile)

  if (values.length === 0) {
    return null
  }

  /* increment perm */
  let changedIndex = 0

  for (let i = 0; i < values.length; ++i) {
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

    // if incremented digit overflow
    if (values[i].equals(length[i])) {
      // if all digits overflow
      if (i === values.length - 1) {
        return null
      }

      // reset overflow digit
      values[i] = BigInt.zero
    } else {
      // done incrementing
      changedIndex = i

      break
    }
  }

  /* check restrictions */
  const restriction = changedIndex < propsKeys.length
    ? checkRestriction(values, 0, propsKeys, metaFile.config.mutex, metaFile.config.mutin)
    : checkRestriction(values, propsKeys.length, metaFile.childrenConfig!.children, metaFile.childrenConfig!.mutex, metaFile.childrenConfig!.mutin)

  switch (restriction) {
    case RESTRICTION_MUTEX:
      return getNextPerm(decimal.plus(getNumSkipMutex(values, length, changedIndex)), metaFile)
    case RESTRICTION_MUTIN:
      return getNextPerm(decimal.plus(BigInt.one), metaFile)
  }

  return permToDecimal(values, length)
}
