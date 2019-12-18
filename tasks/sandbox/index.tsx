import React, { FC } from 'react'
import { Reducer } from 'redux'
import { App as SandboxApp } from '@sandbox/ui'
import { isUndefined } from 'tsfn'
import { component, startWithType, mapHandlers, pureComponent } from 'refun'
import { IconPlus } from '../../packages/sandbox/ui/src/components/icons/plus'
import { SizeText } from '../../packages/sandbox/ui/src/components/size-text'
import { injectReducer } from '../../packages/sandbox/ui/src/store'
import { TActionWithPayload } from '../../packages/sandbox/ui/src/types'
import { Layout, Layout_Item } from '../../packages/sandbox/ui/src/components/layout'
import { Button } from '../../packages/sandbox/ui/src/components/button'
import { components } from './components'

type TState = {
  hello: string,
}

const reducer: Reducer<TState, TActionWithPayload<'hello', string>> = (state, action) => {
  if (isUndefined(state)) {
    return {
      hello: 'jopa',
    }
  }

  switch (action.type) {
    case 'hello': {
      return {
        ...state,
        hello: action.payload,
      }
    }

    default: {
      return state
    }
  }
}

const { mapStoreState, mapStoreDispatch } = injectReducer(reducer)

const Popover = component(
  startWithType<{}>(),
  mapStoreState(({ hello }) => ({
    hello,
  }), ['hello']),
  mapStoreDispatch,
  mapHandlers({
    onPress: ({ dispatch }) => () => {
      dispatch({
        type: 'hello',
        payload: 'govno',
      })
    },
  })
)(({ hello, onPress }) => (
  <Layout direction="vertical">
    <Layout_Item>
      <SizeText>
        {hello}
      </SizeText>
    </Layout_Item>
    <Layout_Item>
      <Button onPress={onPress}>
        <SizeText>
          Change
        </SizeText>
      </Button>
    </Layout_Item>
  </Layout>
))

Popover.componentSymbol = Symbol('PLUGIN_POPOVER')

export type TProvider = {
  Component: FC,
  props: any,
}

export const Provider = pureComponent(
  startWithType<TProvider>()
)(({ Component, props }) => (
  <Component {...props}/>
))

export const App = () => (
  <SandboxApp
    components={components}
    copyImportPackageName={'primitives'}
    plugin={{
      Icon: IconPlus,
      Popover,
      tooltip: 'my tooltip',
      Provider,
    }}
  />
)
