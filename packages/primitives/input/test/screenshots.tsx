import React from 'react'
import { createAutoprops } from 'react-autoprops'
import { serializeObjectToJson } from '@x-ray/common-utils'
import { Input } from '../src'
import * as metaFile from '../meta'

// createChildren(metaFile.childrenConfig, children)

const autoprops = createAutoprops(metaFile)

export default autoprops.map((props, index) => {
  return {
    options: {
      name: `${index}:${serializeObjectToJson(props)}`,
      hasOwnWidth: true,
      maxWidth: 600,
    },
    element: (
      <Input {...props}/>
    ),
  }
})