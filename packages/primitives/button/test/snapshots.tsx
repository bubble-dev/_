import React from 'react'
import { mapPropsIterable } from 'autoprops'
import { TMeta } from '@x-ray/snapshots'
import { Button } from '../src'
import * as metaFile from '../meta'

export default mapPropsIterable(metaFile, ({ id, props }): TMeta => ({
  id,
  element: <Button {...props}/>,
}))
