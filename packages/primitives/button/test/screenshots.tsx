import React from 'react'
import { createAutoprops, createAutopropsFilenames } from 'react-autoprops'
import { Text } from '@primitives/text'
import { Button } from '../src'
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
      <Button {...props}>
        <Text>Button</Text>
      </Button>
    ),
  }
})
