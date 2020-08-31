import React from 'react'
import { normalizeNativeStyle } from 'stili'
import { component, startWithType, mapDefaultProps, mapWithProps } from 'refun'
import { Image as ImageRN } from 'react-native'
import type { ImageStyle } from 'react-native'
import { mapImageLoad } from './map-image-load'
import type { TImage } from './types'

export const Image = component(
  startWithType<TImage>(),
  mapImageLoad(),
  mapDefaultProps({
    resizeMode: 'cover',
  }),
  mapWithProps(({ bottomLeftRadius, bottomRightRadius, topLeftRadius, topRightRadius, resizeMode }) => ({
    style: normalizeNativeStyle<ImageStyle>({
      borderBottomLeftRadius: bottomLeftRadius,
      borderBottomRightRadius: bottomRightRadius,
      borderTopLeftRadius: topLeftRadius,
      borderTopRightRadius: topRightRadius,
      _nativeOnly: {
        resizeMode,
      },
    }),
  }))
)(({ source, id, height, width, style, onLoad, onError }) => (
  <ImageRN
    testID={id}
    source={{
      uri: source,
      width,
      height,
    }}
    fadeDuration={0}
    style={style}
    onLoad={onLoad}
    onError={onError}
  />
))

Image.displayName = 'Image'
