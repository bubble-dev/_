import React from 'react'
import { mapPropsIterable } from 'autoprops'
import { TMeta } from '@x-ray/screenshot-utils'
import { serializeComponent } from 'syntx'
import { Button } from '../src'
import * as metaFile from '../meta'

export default mapPropsIterable(metaFile, ({ id, props }): TMeta => ({
  id,
  serializedElement: serializeComponent(metaFile.Component, props, { indent: 2 }).map(({ elements }) => elements),
  options: {
    hasOwnWidth: true,
    maxWidth: 600,
  },
  element: (
    <Button {...props}/>
  ),
}))
