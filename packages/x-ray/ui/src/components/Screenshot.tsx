import React from 'react'
import { startWithType, component, mapWithProps } from 'refun'
import { TApiLoadScreenshotOpts, getScreenshotUrl } from '../api'
import { mapStoreDispatch } from '../store'
import { TSize } from './types'

export type TScreenshot = TSize & TApiLoadScreenshotOpts

export const Screenshot = component(
  startWithType<TScreenshot>(),
  mapStoreDispatch,
  mapWithProps((props) => ({
    src: getScreenshotUrl(props),
  }))
  // mapRef('src', null),
  // onMount(({ file, props, type, dispatch, src, onLoad }) => {
  //   (async () => {
  //     try {
  //       const { blob, width, height, dpr } = await apiLoadScreenshot({ file, props, type })
  //       const url = URL.createObjectURL(blob)

  //       src.current = url

  //       onLoad({
  //         width: width / dpr,
  //         height: height / dpr,
  //       })
  //     } catch (err) {
  //       dispatch(actionError(err.message))
  //     }
  //   })()
  // }),
  // mapHandlers({
  //   onLoad: ({ src }) => () => {
  //     URL.revokeObjectURL(src.current)
  //   },
  // })
)(({ src, width, height, type }) => {
  // if (src === null) {
  //   return null
  // }

  return (
    <img
      style={{
        border: `1px solid ${type === 'new' ? '#00ff00' : '#ff0000'}`,
        width,
        height,
      }}
      src={src}
    />
  )
})
