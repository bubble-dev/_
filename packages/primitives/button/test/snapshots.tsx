import React from 'react'
import { SerializeObjectToJson } from '@x-ray/common-utils'
import { map } from 'iterama'
import { getPropsIterable } from 'autoprops'
import { Button, TButton } from '../src'
import * as metaFile from '../meta'

const serializeObjectToJson = SerializeObjectToJson()

export default map((props: TButton) => {
  return {
    options: {
      name: serializeObjectToJson(props),
    },
    element: <Button {...props}>Button_</Button>,
  }
})(getPropsIterable(metaFile))
