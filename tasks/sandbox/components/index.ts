import type { TComponents } from '@sandbox/ui'

export const components: TComponents = {
  Button: () => import('@primitives/button/meta' /* webpackChunkName: "Button" */),
  Checkbox: () => import('@primitives/checkbox/meta' /* webpackChunkName: "Checkbox" */),
  Heading: () => import('@primitives/heading/meta' /* webpackChunkName: "Heading" */),
  Input: () => import('@primitives/input/meta' /* webpackChunkName: "Input" */),
  OverideDemo: () => import('@themeables/core/meta' /* webpackChunkName: "CoreThemable" */),
  LayoutThemeable: () => import('@themeables/layout/meta' /* webpackChunkName: "LayoutThemeable" */),
  TextAlignThemeable: () => import('@themeables/text-align/meta' /* webpackChunkName: "TextAlignThemeable" */),
  Paragraph: () => import('@primitives/paragraph/meta' /* webpackChunkName: "Paragraph" */),
  VectorShape: () => import('@primitives/vector-shape/meta' /* webpackChunkName: "VectorShape" */),
  Svg: () => import('@primitives/svg/meta' /* webpackChunkName: "Svg" */),
  TestLottie: () => import('test-lottie/meta' /* webpackChunkName: "TestLottie" */),
  Radio: () => import('@primitives/radio/meta' /* webpackChunkName: "Radio" */),
  Spacer: () => import('@primitives/spacer/meta' /* webpackChunkName: "Spacer" */),
}
