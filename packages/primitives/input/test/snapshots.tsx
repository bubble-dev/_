import React from 'react'
import { mapPropsIterable } from 'autoprops'
import { TMeta } from '@x-ray/snapshots'
import { Input } from '../src'
import * as metaFile from '../meta'

export default mapPropsIterable(metaFile, ({ id, props }): TMeta => ({
  id,
  element: <Input {...props}/>,
}))
