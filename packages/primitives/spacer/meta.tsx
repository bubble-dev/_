import React from 'react'
import { TComponentConfig } from 'autoprops'
import { Layout, LayoutInFlow } from '@primitives/layout'
import { TSpacer, Spacer } from './src'

export const config: TComponentConfig<TSpacer> = {
  props: {
    blockStart: [10, 40],
    blockEnd: [10, 40],
    inlineStart: [10, 40],
    inlineEnd: [10, 40],
  },
}

export const Component = (props: TSpacer) => (
  <Layout direction="vertical" hAlign="center">
    <LayoutInFlow>
      blockStart
    </LayoutInFlow>
    <LayoutInFlow>
      <Layout direction="horizontal" vAlign="center">
        <LayoutInFlow>
          inlineStart
        </LayoutInFlow>
        <LayoutInFlow>
          <Spacer {...props}/>
        </LayoutInFlow>
        <LayoutInFlow>
          inlineEnd
        </LayoutInFlow>
      </Layout>
      </LayoutInFlow>
    <LayoutInFlow>
      blockEnd
    </LayoutInFlow>
  </Layout>
)

export { default as packageJson } from './package.json'
