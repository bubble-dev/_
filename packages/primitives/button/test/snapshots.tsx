import React from 'react'
import { createAutoprops } from 'react-autoprops'
import { SerializeObjectToJson } from '@x-ray/common-utils'
import { Button } from '../src'
import * as metaFile from '../meta'

// createChildren(metaFile.childrenConfig, children)

const autoprops = createAutoprops(metaFile)
const serializeObjectToJson = SerializeObjectToJson()

export default autoprops.map((props) => {
  return {
    options: {
      name: serializeObjectToJson(props),
    },
    element: <Button {...props}>Button_</Button>,
  }
})
