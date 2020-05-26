import { TComponents } from '@sandbox/ui'
/* eslint-disable import/no-extraneous-dependencies */
import * as Button from '@primitives/button/meta'
import * as Input from '@primitives/input/meta'
import * as Checkbox from '@primitives/checkbox/meta'
import * as VectorShape from '@primitives/vector-shape/meta'
import * as TestLottie from 'test-lottie/meta'
import * as Radio from '@primitives/radio/meta'
import * as LayoutThemeable from '@themeables/layout/meta'

export const components: TComponents = {
  Button: () => Promise.resolve(Button),
  Input: () => Promise.resolve(Input),
  Checkbox: () => Promise.resolve(Checkbox),
  VectorShape: () => Promise.resolve(VectorShape),
  TestLottie: () => Promise.resolve(TestLottie),
  Radio: () => Promise.resolve(Radio),
  LayoutThemeable: () => Promise.resolve(LayoutThemeable),
}
