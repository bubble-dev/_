import React, { Fragment } from 'react'
import { isUndefined } from 'tsfn'
import { TResult } from '@x-ray/common-utils'
import { component, startWithType } from 'refun'
import { mapStoreState } from '../store'
import { File } from './File'
import { Block } from './Block'
import { TRect } from './types'

export type TList = {
  title: string,
  list: string[],
  files: TResult,
  kind: 'image' | 'text',
  onSelect: (file: string, item: string, type: string) => void,
  onMove: (file: string) => void,
} & TRect

export const List = component(
  startWithType<TList>(),
  mapStoreState(({ selectedFile, selectedItem, selectedType }) => ({
    selectedFile,
    selectedItem,
    selectedType,
  }), ['selectedFile', 'selectedItem', 'selectedType'])
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

    {list.length > 0 && !isUndefined(kind) &&
      list
        .map((file) => {
          const data = files[file]

          return (
            <div key={file}>
              <div>
                <div>
                  <h3 key={file} onDoubleClick={() => onMove(file)}>
                    {file}
                  </h3>
                </div>
                {data.new.length > 0 && (
                  <ul>
                    {data.new.map((item) => {
                      const isSelected = selectedFile === file && selectedItem === item && selectedType === 'new'

                      return (
                        <li style={{ backgroundColor: isSelected ? '#eee' : '#fff' }} key={`${file}:new:${item}`}>
                          <h4 onClick={() => onSelect(file, item, 'new')}>new: {item}</h4>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>

              {data.diff.length > 0 && (
                <Fragment>
                  <h4 key={`${file}:diff`}>diff: {data.diff.length}</h4>
                  {data.diff.map((item) => (
                    <div key={`${file}:diff:${item}`}>
                      <h5>{item}</h5>
                      <File
                        kind={kind}
                        type="old"
                        file={file}
                        item={item}
                      />
                      <File
                        kind={kind}
                        type="new"
                        file={file}
                        item={item}
                      />
                    </div>
                  ))}
                </Fragment>
              )}

              {data.deleted.length > 0 && (
                <Fragment>
                  <h4 key={`${file}:deleted`}>deleted: {data.deleted.length}</h4>
                  {data.deleted.map((item) => (
                    <div key={`${file}:deleted:${item}`}>
                      <h5>{item}</h5>
                      <File
                        kind={kind}
                        type="old"
                        file={file}
                        item={item}
                      />
                    </div>
                  ))}
                </Fragment>
              )}
            </div>
          )
        })
      }
  </Block>
))
