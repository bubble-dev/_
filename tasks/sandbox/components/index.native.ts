import { TComponents } from '@sandbox/ui'
/* eslint-disable import/no-extraneous-dependencies */
import * as Button from '@primitives/button/meta'
import * as Checkbox from '@primitives/checkbox/meta'
import * as Heading from '@primitives/heading/meta'
import * as Input from '@primitives/input/meta'
import * as LayoutThemeable from '@themeables/layout/meta'
import * as Paragraph from '@primitives/paragraph/meta'
import * as Radio from '@primitives/radio/meta'
import * as Spacer from '@primitives/spacer/meta'
import * as TestLottie from 'test-lottie/meta'
import * as VectorShape from '@primitives/vector-shape/meta'

export const components: TComponents = {
  Button: () => Promise.resolve(Button),
  Checkbox: () => Promise.resolve(Checkbox),
  Heading: () => Promise.resolve(Heading),
  Input: () => Promise.resolve(Input),
  LayoutThemeable: () => Promise.resolve(LayoutThemeable),
  Paragraph: () => Promise.resolve(Paragraph),
  Radio: () => Promise.resolve(Radio),
  Spacer: () => Promise.resolve(Spacer),
  TestLottie: () => Promise.resolve(TestLottie),
  VectorShape: () => Promise.resolve(VectorShape),
}
