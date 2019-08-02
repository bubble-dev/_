import React from 'react'
import { isUndefined } from 'tsfn'
import { component, startWithType } from 'refun'
import { TResult } from '@x-ray/common-utils'
import { mapStoreState } from '../store'
import { TResultType } from '../types'
import { Block } from './Block'
import { TRect } from './types'

const TYPES = [
  'new' as const,
  'diff' as const,
  'deleted' as const,
]

export type TList = {
  title: string,
  list: TResult,
  onSelect: (file: string, item: string, type: TResultType) => void,
  onMove: (file: string, item: string, type: TResultType) => void,
} & TRect

export const List = component(
  startWithType<TList>(),
  mapStoreState(({ files, kind, selectedFile, selectedItem, selectedType }) => ({
    files,
    kind,
    selectedFile,
    selectedItem,
    selectedType,
  }), ['files', 'kind', 'selectedFile', 'selectedItem', 'selectedType'])
)(({
  files,
  list,
  kind,
  title,
  selectedFile,
  selectedItem,
  selectedType,
  top,
  left,
  width,
  height,
  onSelect,
  onMove,
}) => (
  <Block
    top={top}
    left={left}
    width={width}
    height={height}
    shouldScroll
  >
    <h2>{title}:</h2>
    <ul>
      {!isUndefined(files) && !isUndefined(kind) && Object.keys(list).length > 0 &&
        Object.keys(list).map((file) => {
          const data = list[file]

          return (
            <li key={file}>
              <h3 key={file}>{file} </h3>

              {
                TYPES.map((type) => {
                  if (!data[type] || data[type].length === 0) {
                    return null
                  }

                  return (
                    <ul key={type}>
                      {data[type].map((item) => {
                        const isSelected = selectedFile === file && selectedItem === item && selectedType === type

                        return (
                          <li style={{ backgroundColor: isSelected ? '#eee' : '#fff' }} key={item}>
                            <h4
                              onClick={() => onSelect(file, item, type)}
                              onDoubleClick={() => onMove(file, item, type)}
                            >
                              {type}: {item}
                            </h4>
                          </li>
                        )
                      })}
                    </ul>
                  )
                })
              }
            </li>
          )
        })
      }
    </ul>
  </Block>
))
