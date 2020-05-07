import { TComponents } from '@sandbox/ui'

export const components: TComponents = {
  Button: () => import('@primitives/button/meta' /* webpackChunkName: "Button" */),
  Checkbox: () => import('@primitives/checkbox/meta' /* webpackChunkName: "Checkbox" */),
  Input: () => import('@primitives/input/meta' /* webpackChunkName: "Input" */),
  Heading: () => import('@primitives/heading/meta' /* webpackChunkName: "Heading" */),
  Paragraph: () => import('@primitives/paragraph/meta' /* webpackChunkName: "Paragraph" */),
  Radio: () => import('@primitives/radio/meta' /* webpackChunkName: "Radio" */),
  TestLottie: () => import('test-lottie/meta' /* webpackChunkName: "TestLottie" */),
  VectorShape: () => import('@primitives/vector-shape/meta' /* webpackChunkName: "VectorShape" */),
}

