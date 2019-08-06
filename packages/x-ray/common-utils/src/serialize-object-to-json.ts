import { types } from 'util'
import { isValidElement, ReactElement, FC } from 'react'
import { TAnyObject, isFunction, isSymbol, isUndefined } from 'tsfn'

export const getElementName = (element: ReactElement<any>) => {
  if (typeof element.type === 'string') {
    return element.type
  }

  return (element.type as FC<any>).displayName || element.type.name
}

export const SerializeObjectToJson = () => {
  let functionIndex = -1
  let symbolIndex = -1
  let regexpIndex = -1
  let elementIndex = -1

  return (obj: TAnyObject): string => JSON.stringify(obj, (key, value) => {
    if (isFunction(value)) {
      functionIndex++

      return value.name === '' ? `[function (${functionIndex})]` : `[function(${value.name}) (${functionIndex})]`
    }
    if (isSymbol(value)) {
      symbolIndex++

      return isUndefined(value.description) ? `[symbol (${symbolIndex})]` : `[symbol(${value.description}) (${symbolIndex})]`
    }
    if (types.isRegExp(value)) {
      regexpIndex++

      return `[regexp(${value.toString()}) (${regexpIndex})]`
    }
    if (isValidElement(value)) {
      elementIndex++

      return `[react(${getElementName(value)}) (${elementIndex})]`
    }

    return value
  })
}
