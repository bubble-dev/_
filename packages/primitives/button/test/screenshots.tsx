import React from 'react'
import { createAutoprops } from 'react-autoprops'
import { Text } from '@primitives/text'
import { SerializeObjectToJson } from '@x-ray/common-utils'
import { Button } from '../src'
import * as metaFile from '../meta'

const autoprops = createAutoprops(metaFile)
const serializeObjectToJson = SerializeObjectToJson()

export default autoprops.map((props) => {
  return {
    options: {
      name: serializeObjectToJson(props),
      hasOwnWidth: true,
      maxWidth: 600,
    },
    element: (
      <Button {...props}>
        <Text>Button_</Text>
      </Button>
    ),
  }
})
