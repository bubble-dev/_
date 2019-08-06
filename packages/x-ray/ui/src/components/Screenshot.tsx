import React from 'react'
import { startWithType, component, onMount, mapHandlers, mapRef } from 'refun'
import { apiLoadScreenshot, TApiLoadScreenshotOpts } from '../api'
import { mapStoreDispatch } from '../store'
import { actionError } from '../actions'
import { TSize } from './types'

export type TScreenshot = TSize & TApiLoadScreenshotOpts & {
  onLoad: (size: TSize) => void,
}

export const Screenshot = component(
  startWithType<TScreenshot>(),
  mapStoreDispatch,
  mapRef('src', null),
  onMount(({ file, props, type, dispatch, src, onLoad }) => {
    (async () => {
      try {
        const { blob, width, height, dpr } = await apiLoadScreenshot({ file, props, type })
        const url = URL.createObjectURL(blob)

        src.current = url

        onLoad({
          width: width / dpr,
          height: height / dpr,
        })
      } catch (err) {
        dispatch(actionError(err.message))
      }
    })()
  }),
  mapHandlers({
    onLoad: ({ src }) => () => {
      URL.revokeObjectURL(src.current)
    },
  })
)(({ src, width, height, type, onLoad }) => {
  if (src === null) {
    return null
  }

  return (
    <img
      style={{
        border: `1px solid ${type === 'new' ? '#00ff00' : '#ff0000'}`,
        width,
        height,
      }}
      src={src.current}
      onLoad={onLoad}
    />
  )
})
