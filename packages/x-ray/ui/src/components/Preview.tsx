import React, { Fragment } from 'react'
import { component, startWithType, mapWithProps, mapState, mapSafeTimeout, mapHandlers, mapRef, onChange, onMount } from 'refun'
import { isUndefined } from 'tsfn'
import { easeInOutCubic, Animation } from '@primitives/animation'
import { elegir } from 'elegir'
import { mapStoreState } from '../store'
import { TRect, TGridItem } from '../types'
import { DIFF_TIMEOUT } from '../config'
import { Block } from './Block'
import { ScreenshotDiff } from './ScreenshotDiff'
import { ScreenshotNew } from './ScreenshotNew'
import { Snapshot } from './Snapshot'
import { ScreenshotDeleted } from './ScreenshotDeleted'

export type TPreview = TRect & {
  selectedItem: TGridItem,
}

export const Preview = component(
  startWithType<TPreview>(),
  mapStoreState(({ type }) => ({
    type,
  }), ['type']),
  mapWithProps(({ width, height }) => ({
    halfWidth: width / 2,
    halfHeight: height / 2,
  })),
  // diff state
  mapState('diffState', 'setDiffState', () => false, []),
  mapSafeTimeout('setSafeTimeout'),
  mapHandlers({
    toggleDiffState: ({ setDiffState, diffState }) => () => {
      setDiffState(!diffState)
    },
  }),
  mapRef('clearDiffTimeout', null as any),
  onChange(({ toggleDiffState, clearDiffTimeout, setSafeTimeout, selectedItem }) => {
    if (clearDiffTimeout.current !== null) {
      clearDiffTimeout.current()
      clearDiffTimeout.current = null
    }

    if (selectedItem.type === 'diff') {
      clearDiffTimeout.current = setSafeTimeout(toggleDiffState, DIFF_TIMEOUT)
    }
  }, ['diffState', 'selectedItem']),
  onMount(({ clearDiffTimeout, toggleDiffState, setSafeTimeout, selectedItem }) => {
    if (selectedItem.type === 'diff') {
      clearDiffTimeout.current = setSafeTimeout(toggleDiffState, DIFF_TIMEOUT)
    }
  })
)(({ top, left, width, height, halfWidth, halfHeight, type, selectedItem, diffState }) => {
  return (
    <Block
      top={top}
      left={left}
      width={width}
      height={height}
    >
      {!isUndefined(type) && (
        <Fragment>
          {selectedItem.type === 'new' && type === 'image' && (
            <ScreenshotNew
              key={`${selectedItem.file}:new:${selectedItem.id}`}
              top={halfHeight - selectedItem.height / 2}
              left={halfWidth - selectedItem.width / 2}
              width={selectedItem.width}
              height={selectedItem.height}
              file={selectedItem.file}
              id={selectedItem.id}
            />
          )}

          {selectedItem.type === 'diff' && type === 'image' && (
            <Animation time={200} easing={easeInOutCubic} values={[diffState ? 1 : 0]}>
              {([alpha]) => (
                <ScreenshotDiff
                  key={`${selectedItem.file}:diff:${selectedItem.id}`}
                  top={halfHeight - selectedItem.height / 2}
                  left={halfWidth - selectedItem.width / 2}
                  oldWidth={selectedItem.width}
                  oldHeight={selectedItem.height}
                  newWidth={selectedItem.newWidth}
                  newHeight={selectedItem.newHeight}
                  oldAlpha={1 - alpha}
                  newAlpha={alpha}
                  file={selectedItem.file}
                  id={selectedItem.id}
                />
              )}
            </Animation>
          )}

          {selectedItem.type === 'deleted' && type === 'image' && (
            <ScreenshotDeleted
              key={`${selectedItem.file}:deleted:${selectedItem.id}`}
              top={halfHeight - selectedItem.height / 2}
              left={halfWidth - selectedItem.width / 2}
              width={selectedItem.width}
              height={selectedItem.height}
              file={selectedItem.file}
              id={selectedItem.id}
            />
          )}

          {type === 'text' && (
            <Snapshot
              key={`${selectedItem.file}:${selectedItem.type}:${selectedItem.id}`}
              top={68}
              left={0}
              width={width}
              height={height}
              file={selectedItem.file}
              id={selectedItem.id}
              type={elegir(
                selectedItem.type === 'new',
                'new',
                selectedItem.type === 'deleted',
                'old',
                true,
                'diff'
              )}
            />
          )}
        </Fragment>
      )}
    </Block>
  )
})
