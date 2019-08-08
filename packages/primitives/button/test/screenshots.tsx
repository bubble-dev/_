import React from 'react'
import { getPropsIterable } from 'autoprops'
import { Text } from '@primitives/text'
import { SerializeObjectToJson } from '@x-ray/common-utils/src/serialize-object-to-json'
import { map } from 'iterama'
import { Button, TButton } from '../src'
import * as metaFile from '../meta'

const serializeObjectToJson = SerializeObjectToJson()

export default map((props: TButton) => {
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
})(getPropsIterable(metaFile))
