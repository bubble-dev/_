import React from 'react'
import { SerializeObjectToJson } from '@x-ray/common-utils/src/serialize-object-to-json'
import { getPropsIterable } from 'autoprops'
import { map } from 'iterama'
import { Input, TInput } from '../src'
import * as metaFile from '../meta'

const serializeObjectToJson = SerializeObjectToJson()

export default map((props: TInput) => ({
  options: {
    name: serializeObjectToJson(props),
    hasOwnWidth: true,
    maxWidth: 600,
  },
  element: (
    <Input {...props}/>
  ),
}))(getPropsIterable(metaFile))
