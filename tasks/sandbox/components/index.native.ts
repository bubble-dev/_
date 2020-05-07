import { TComponents } from '@sandbox/ui'
/* eslint-disable import/no-extraneous-dependencies */
import * as Button from '@primitives/button/meta'
import * as Checkbox from '@primitives/checkbox/meta'
import * as Input from '@primitives/input/meta'
import * as Heading from '@primitives/heading/meta'
import * as Radio from '@primitives/radio/meta'
import * as TestLottie from 'test-lottie/meta'
import * as VectorShape from '@primitives/vector-shape/meta'

export const components: TComponents = {
  Button: () => Promise.resolve(Button),
  Checkbox: () => Promise.resolve(Checkbox),
  Input: () => Promise.resolve(Input),
  Heading: () => Promise.resolve(Heading),
  Radio: () => Promise.resolve(Radio),
  TestLottie: () => Promise.resolve(TestLottie),
  VectorShape: () => Promise.resolve(VectorShape),
}
