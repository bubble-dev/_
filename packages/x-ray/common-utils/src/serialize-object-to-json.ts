import { isValidElement, ReactElement, FC } from 'react'
import { TAnyObject, isFunction, isSymbol, isUndefined, isRegExp } from 'tsfn'

export const getElementName = (element: ReactElement<any>) => {
  if (typeof element.type === 'string') {
    return element.type
  }

  return (element.type as FC<any>).displayName || element.type.name
}
