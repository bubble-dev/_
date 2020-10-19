import type { TComponents } from '@sandbox/ui'
/* eslint-disable import/no-extraneous-dependencies */
import * as Button from '@primitives/button/meta'
import * as Checkbox from '@primitives/checkbox/meta'
import * as Heading from '@primitives/heading/meta'
import * as Input from '@primitives/input/meta'
import * as LayoutThemeable from '@themeables/layout/meta'
import * as OverideDemo from '@themeables/core/meta'
import * as OverideDemo2 from '@themeables/core2/meta'
import * as Paragraph from '@primitives/paragraph/meta'
import * as Radio from '@primitives/radio/meta'
import * as Spacer from '@primitives/spacer/meta'
import * as Svg from '@primitives/svg/meta'
import * as TestLottie from 'test-lottie/meta'
import * as TextAlignThemeable from '@themeables/text-align/meta'
import * as ThemeableBackground2 from '@themeables/background2/meta'
import * as ThemeableBackground3 from '@themeables/background3/meta'
import * as VectorShape from '@primitives/vector-shape/meta'

export const components: TComponents = {
  Button: () => Promise.resolve(Button),
  Checkbox: () => Promise.resolve(Checkbox),
  Heading: () => Promise.resolve(Heading),
  Input: () => Promise.resolve(Input),
  LayoutThemeable: () => Promise.resolve(LayoutThemeable),
  OverideDemo2: () => Promise.resolve(OverideDemo2),
  OverideDemo: () => Promise.resolve(OverideDemo),
  Paragraph: () => Promise.resolve(Paragraph),
  Radio: () => Promise.resolve(Radio),
  Spacer: () => Promise.resolve(Spacer),
  Svg: () => Promise.resolve(Svg),
  TestLottie: () => Promise.resolve(TestLottie),
  TextAlignThemeable: () => Promise.resolve(TextAlignThemeable),
  ThemeableBackground2: () => Promise.resolve(ThemeableBackground2),
  ThemeableBackground3: () => Promise.resolve(ThemeableBackground3),
  VectorShape: () => Promise.resolve(VectorShape),
}
