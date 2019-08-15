import React from 'react'
import { startWithType, component, mapState, onMount } from 'refun'
import { diffArrays } from 'diff'
import { elegir } from 'elegir'
import { TOmitKey } from 'tsfn'
import { apiLoadSnapshot, TApiLoadSnapshotOpts } from '../api'
import { mapStoreDispatch } from '../store'
import { actionError } from '../actions'
import { TRect } from './types'
import { Block } from './Block'

type TSnapshotData = {
  value: string,
  isAdded: boolean,
  isRemoved: boolean,
}[]

type TSnapshotState = TSnapshotData | null

export type TSnapshotDiff = TOmitKey<TApiLoadSnapshotOpts, 'type'> & TRect

export const SnapshotDiff = component(
  startWithType<TSnapshotDiff>(),
  mapStoreDispatch,
  mapState('state', 'setState', () => null as TSnapshotState, []),
  onMount(({ setState, file, props, dispatch }) => {
    (async () => {
      try {
        const [oldData, newData] = await Promise.all([
          apiLoadSnapshot({ file, props, type: 'old' }),
          apiLoadSnapshot({ file, props, type: 'new' }),
        ])
        const diffData = diffArrays(oldData.split('\n'), newData.split('\n'))

        const data = diffData.reduce((result, chunk) => {
          return result.concat(
            chunk.value.map((line) => ({
              value: line,
              isAdded: Boolean(chunk.added),
              isRemoved: Boolean(chunk.removed),
            }))
          )
        }, [] as TSnapshotData)

        setState(data)
      } catch (err) {
        console.log(err)
        dispatch(actionError(err.message))
      }
    })()
  })
)(({ state, top, left, width, height }) => {
  if (state === null) {
    return null
  }

  return (
    <Block top={top} left={left} width={width} height={height}>
      <div
        style={{
          fontSize: 12,
          fontFamily: 'monospace',
          border: '1px solid red',
          width: 400,
          height: 500,
          overflow: 'scroll',
          resize: 'both',
          whiteSpace: 'pre',
        }}
      >
        {state.map((item, i) => (
          <div
            style={{
              backgroundColor: elegir(
                item.isAdded,
                '#00ff00',
                item.isRemoved,
                '#ff0000'
              ),
            }}
            key={i}
          >
            {item.value}
          </div>
        ))}
      </div>
    </Block>
  )
})
