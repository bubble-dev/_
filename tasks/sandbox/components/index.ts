import { TComponents } from '@sandbox/ui'

export const components: TComponents = {
  Button: () => import('@primitives/button/meta' /* webpackChunkName: "Button" */),
  Input: () => import('@primitives/input/meta' /* webpackChunkName: "Input" */),
  Checkbox: () => import('@primitives/checkbox/meta' /* webpackChunkName: "Checkbox" */),
  VectorShape: () => import('@primitives/vector-shape/meta' /* webpackChunkName: "VectorShape" */),
  TestLottie: () => import('test-lottie/meta' /* webpackChunkName: "TestLottie" */),
  Radio: () => import('@primitives/radio/meta' /* webpackChunkName: "Radio" */),
  LayoutThemeable: () => import('@themeables/layout/meta' /* webpackChunkName: "LayoutThemeable" */),
}

