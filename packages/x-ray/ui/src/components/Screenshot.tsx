import React from 'react'
import { startWithType, component, mapRef, onMount, mapHandlers, mapWithProps } from 'refun'
import { apiLoadScreenshot, TApiLoadScreenshotOpts, getScreenshotUrl } from '../api'
import { mapStoreDispatch } from '../store'
import { TSize } from '../types'
import { actionError } from '../actions'

export type TScreenshot = TSize & TApiLoadScreenshotOpts

export const Screenshot = component(
  startWithType<TScreenshot>(),
  mapStoreDispatch,
  mapWithProps(({ file, props, type, width, height }) => ({
    src: getScreenshotUrl({ file, props, type, width, height }),
  }))
  // mapRef('src', null),
  // onMount(({ dispatch, src, ...opts }) => {
  //   (async () => {
  //     try {
  //       const blob = await apiLoadScreenshot(opts)
  //       const url = URL.createObjectURL(blob)

  //       console.log(url)

  //       src.current = url
  //     } catch (err) {
  //       console.log(err)
  //       dispatch(actionError(err.message))
  //     }
  //   })()
  // }),
  // mapHandlers({
  //   onLoad: ({ src }) => () => {
  //     URL.revokeObjectURL(src.current)
  //   },
  // })
)(({ src, width, height }) => {
  if (src === null) {
    return null
  }

  return (
    <img
      style={{
        width,
        height,
      }}
      src={src}
      // onLoad={onLoad}
    />
  )
})
