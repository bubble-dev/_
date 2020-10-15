import type { TComponents } from '@sandbox/ui'

export const components: TComponents = {
  Button: () => import('@primitives/button/meta' /* webpackChunkName: "Button" */),
  Checkbox: () => import('@primitives/checkbox/meta' /* webpackChunkName: "Checkbox" */),
  Heading: () => import('@primitives/heading/meta' /* webpackChunkName: "Heading" */),
  Input: () => import('@primitives/input/meta' /* webpackChunkName: "Input" */),
  LayoutThemeable: () => import('@themeables/layout/meta' /* webpackChunkName: "LayoutThemeable" */),
  OverideDemo: () => import('@themeables/core/meta' /* webpackChunkName: "CoreThemable" */),
  OverideDemo2: () => import('@themeables/core2/meta' /* webpackChunkName: "CoreThemable2" */),
  OverideDemo3: () => import('@themeables/core3/meta' /* webpackChunkName: "CoreThemable3" */),
  Paragraph: () => import('@primitives/paragraph/meta' /* webpackChunkName: "Paragraph" */),
  Radio: () => import('@primitives/radio/meta' /* webpackChunkName: "Radio" */),
  Spacer: () => import('@primitives/spacer/meta' /* webpackChunkName: "Spacer" */),
  Svg: () => import('@primitives/svg/meta' /* webpackChunkName: "Svg" */),
  TestLottie: () => import('test-lottie/meta' /* webpackChunkName: "TestLottie" */),
  TextAlignThemeable: () => import('@themeables/text-align/meta' /* webpackChunkName: "TextAlignThemeable" */),
  ThemeableBackground2: () => import('@themeables/background2/meta' /* webpackChunkName: "ThemeableBackground2" */),
  VectorShape: () => import('@primitives/vector-shape/meta' /* webpackChunkName: "VectorShape" */),
}
