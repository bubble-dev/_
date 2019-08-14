import React from 'react'
import { mapPropsIterable } from 'autoprops'
import { TMeta } from '@x-ray/screenshot-utils'
import { Button } from '../src'
import * as metaFile from '../meta'

export default mapPropsIterable(metaFile, ({ id, props }): TMeta => ({
  id,
  options: {
    hasOwnWidth: true,
    maxWidth: 600,
  },
  element: (
    <Button {...props}/>
  ),
}))
