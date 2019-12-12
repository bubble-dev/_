import React from 'react'
import { mapPropsIterable } from 'autoprops'
import { TMeta } from '@x-ray/screenshot-utils'
import { serializeElement } from '@x-ray/common-utils'
import { Component, config } from '../meta'

export default mapPropsIterable(config, ({ id, props }): TMeta => ({
  id,
  serializedElement: serializeElement(Component, props),
  options: {
    hasOwnWidth: true,
    maxWidth: 150,
  },
  element: (
    <Component {...props}/>
  ),
}))