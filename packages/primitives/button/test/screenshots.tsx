import React from 'react'
import { createAutoprops } from 'react-autoprops'
import { Text } from '@primitives/text'
import { serializeObjectToJson } from '@x-ray/common-utils'
import { Button } from '../src'
import * as metaFile from '../meta'

const autoprops = createAutoprops(metaFile)

export default autoprops.map((props, index) => {
  return {
    options: {
      name: `${index}:${serializeObjectToJson(props)}`,
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
