import { types } from 'util'
import { isValidElement, ReactElement, FC } from 'react'
import { TAnyObject, isFunction, isSymbol, isUndefined } from 'tsfn'

export const getElementName = (element: ReactElement<any>) => {
  if (typeof element.type === 'string') {
    return element.type
  }

  return (element.type as FC<any>).displayName || element.type.name
}

export const serializeObjectToJson = (obj: TAnyObject): string => JSON.stringify(obj, (key, value) => {
  if (isFunction(value)) {
    return value.name === '' ? '[function]' : `[function(${value.name})]`
  }

  if (isSymbol(value)) {
    return isUndefined(value.description) ? '[symbol]' : `[symbol(${value.description})]`
  }

  if (types.isRegExp(value)) {
    return `[regexp(${value.toString()})]`
  }

  if (isValidElement(value)) {
    return `[react(${getElementName(value)})]`
  }

  return value
})
