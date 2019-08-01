import React from 'react'
import { isUndefined } from 'tsfn'
import { component, startWithType } from 'refun'
import { mapStoreState } from '../store'
import { Block } from './Block'
import { TRect } from './types'

const TYPES = [
  'new' as const,
  'diff' as const,
  'deleted' as const,
]

export type TList = {
  title: string,
  list: string[],
  onSelect: (file: string, item: string, type: string) => void,
  onMove: (file: string) => void,
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
      {!isUndefined(files) && !isUndefined(kind) && list.length > 0 &&
        list.map((file) => {
          const data = files[file]

          return (
            <li key={file}>
              <h3 key={file} onDoubleClick={() => onMove(file)}>
                {file}
              </h3>

              {
                TYPES.map((type) => {
                  if (data[type].length === 0) {
                    return null
                  }

                  return (
                    <ul key={type}>
                      {data[type].map((item) => {
                        const isSelected = selectedFile === file && selectedItem === item && selectedType === type

                        return (
                          <li style={{ backgroundColor: isSelected ? '#eee' : '#fff' }} key={item}>
                            <h4 onClick={() => onSelect(file, item, type)}>{type}: {item}</h4>
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
