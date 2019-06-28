import React from 'react'
import { createAutoprops, createAutopropsFilenames, createChildren } from 'react-autoprops'
import { Button } from '../src'
import * as metaFile from '../meta'

// createChildren(metaFile.childrenConfig, children)

const autoprops = createAutoprops(metaFile)
const filenames = createAutopropsFilenames(metaFile)

export default autoprops.map((props, propsIndex) => {
  return {
    options: {
      name: filenames[propsIndex],
    },
    element: <Button {...props}>Button</Button>,
  }
})
