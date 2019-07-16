import React from 'react'
import { createAutoprops, createAutopropsFilenames } from 'react-autoprops'
import { Input } from '../src'
import * as metaFile from '../meta'

// createChildren(metaFile.childrenConfig, children)

const autoprops = createAutoprops(metaFile)
const filenames = createAutopropsFilenames(metaFile)

export default autoprops.map((props, propsIndex) => {
  return {
    options: {
      name: filenames[propsIndex],
      hasOwnWidth: true,
      maxWidth: 600,
    },
    element: (
      <Input {...props}/>
    ),
  }
})
