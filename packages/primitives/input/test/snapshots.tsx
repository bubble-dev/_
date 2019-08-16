import React from 'react'
import { mapPropsIterable } from 'autoprops'
import { TMeta } from '@x-ray/snapshots'
import { serializeElement } from '@x-ray/common-utils'
import { Input } from '../src/index.web'
import * as metaFile from '../meta'

export default mapPropsIterable(metaFile, ({ id, props }): TMeta => ({
  id,
  serializedElement: serializeElement(metaFile.Component, props),
  element: <Input {...props}/>,
}))
