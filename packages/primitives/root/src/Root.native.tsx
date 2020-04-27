import React from 'react'
import { View, Dimensions } from 'react-native'
import { normalizeNativeStyle } from 'stili'
import {
  component,
  mapState,
  startWithType,
  mapHandlers,
  mapWithProps,
  onUpdate,
} from 'refun'
import { TRoot } from './types'

export const Root = component(
  startWithType<TRoot>(),
  mapState('dimensions', 'setDimensions', () => {
    const { width, height } = Dimensions.get('window')

    return {
      width,
      height,
    }
  }, []),
  mapHandlers({
    setDimensions: ({ setDimensions }) => ({ window: { width, height } }: any) => setDimensions({
      width,
      height,
    }),
  }),
  onUpdate(({ setDimensions }) => {
    Dimensions.addEventListener('change', setDimensions)

    return () => {
      Dimensions.removeEventListener('change', setDimensions)
    }
  }, []),
  mapWithProps(({ dimensions }) => ({
    styles: normalizeNativeStyle({
      position: 'absolute',
      flexDirection: 'row',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: dimensions.width,
      height: dimensions.height,
    }),
  }))
)(({ children, dimensions, styles }) => (
  <View style={styles}>{children(dimensions)}</View>
))

Root.displayName = 'Root'
