import React from 'react'
import { SerializeObjectToJson } from '@x-ray/common-utils'
import { map } from 'iterama'
import { getPropsIterable } from 'autoprops'
import { Input, TInput } from '../src'
import * as metaFile from '../meta'

const serializeObjectToJson = SerializeObjectToJson()

export default map((props: TInput) => {
  return {
    options: {
      name: serializeObjectToJson(props),
    },
    element: <Input {...props}/>,
  }
})(getPropsIterable(metaFile))
