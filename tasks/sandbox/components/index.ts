import { TComponents } from '@sandbox/ui'

export const components: TComponents = {
  Button: () => import('@primitives/button/meta' /* webpackChunkName: "Button" */),
  Checkbox: () => import('@primitives/checkbox/meta' /* webpackChunkName: "Checkbox" */),
  Heading: () => import('@primitives/heading/meta' /* webpackChunkName: "Heading" */),
  Input: () => import('@primitives/input/meta' /* webpackChunkName: "Input" */),
  LayoutThemeable: () => import('@themeables/layout/meta' /* webpackChunkName: "LayoutThemeable" */),
  Paragraph: () => import('@primitives/paragraph/meta' /* webpackChunkName: "Paragraph" */),
  Radio: () => import('@primitives/radio/meta' /* webpackChunkName: "Radio" */),
  Spacer: () => import('@primitives/spacer/meta' /* webpackChunkName: "Spacer" */),
  TestLottie: () => import('test-lottie/meta' /* webpackChunkName: "TestLottie" */),
  VectorShape: () => import('@primitives/vector-shape/meta' /* webpackChunkName: "VectorShape" */),
}

