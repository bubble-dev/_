import React from 'react'
import { mapPropsIterable } from 'autoprops'
import { TMeta } from '@x-ray/screenshot-utils'
import { Input } from '../src'
import * as metaFile from '../meta'

export default mapPropsIterable(metaFile, ({ id, props }): TMeta => ({
  id,
  options: {
    hasOwnWidth: false,
    maxWidth: 100,
  },
  element: (
    <Input {...props}/>
  ),
}))
