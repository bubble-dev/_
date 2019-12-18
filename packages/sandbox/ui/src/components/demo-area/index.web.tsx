import React, { FC } from 'react'
import {
  mapWithProps,
  startWithType,
  mapDebouncedHandlerTimeout,
  mapState,
  mapHandlers,
  mapWithPropsMemo,
  mapContext,
  component,
} from 'refun'
import { Pointer } from '@primitives/pointer'
import { Transform } from '@primitives/transform'
import { Size } from '@primitives/size'
import { Background } from '@primitives/background'
import { TAnyObject, isDefined } from 'tsfn'
import { TComponentConfig } from 'autoprops'
import { Block } from '../block'
import { BlockRef } from '../block-ref'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { isSafari } from '../../utils/platform-id'
import { CanvasGrid } from '../canvas-grid'
import { TTransform, TPlugin } from '../../types'
import { setTransform } from '../../actions'
import { ThemeContext } from '../theme-provider'
import { LayoutContext } from '../layout-context'
import { SYMBOL_DEMO_AREA } from '../../symbols'
import { SizeBlock } from '../size-block'
import { BLACK, WHITE } from '../theme-provider/colors'
import { mapTransform } from './map-transform'
import { PureComponent } from './pure-component'
import { mapInspectRect } from './map-inspect-rect'

const COMPONENT_MIN_WIDTH = 200
const round10 = (num: number) => Math.round(num / 10) * 10

export type TDemoArea = {
  Component?: FC<any>,
  componentProps?: Readonly<TAnyObject>,
  componentPropsChildrenMap?: Readonly<TAnyObject>,
  componentConfig?: TComponentConfig,
  plugin?: TPlugin,
}

export const DemoArea = component(
  startWithType<TDemoArea>(),
  mapContext(ThemeContext),
  mapContext(LayoutContext),
  mapStoreState(({ isCanvasDarkMode, width, height, hasGrid, shouldStretch, shouldInspect, transformX, transformY, transformZ, selectedElementPath }) => ({
    canvasWidth: width,
    canvasHeight: height,
    shouldStretch,
    shouldInspect,
    hasGrid,
    transform: {
      x: transformX,
      y: transformY,
      z: transformZ,
    },
    selectedElementPath,
    isCanvasDarkMode,
  }), ['isCanvasDarkMode', 'width', 'height', 'hasGrid', 'shouldStretch', 'shouldInspect', 'transformX', 'transformY', 'transformZ', 'selectedElementPath']),
  mapStoreDispatch,
  mapHandlers({
    dispatchTransform: ({ dispatch }) => (transform: TTransform) => dispatch(setTransform(transform)),
  }),
  mapDebouncedHandlerTimeout('dispatchTransform', 150),
  mapWithProps(({ canvasWidth, canvasHeight, _width, _height }) => ({
    canvasLeft: Math.max((_width - canvasWidth) / 2, 0),
    canvasTop: Math.max((_height - canvasHeight) / 2, 0),
  })),
  mapState('componentHeight', 'setComponentHeight', () => 0, []),
  mapWithPropsMemo(({ componentHeight, canvasWidth, canvasHeight, shouldStretch }) => {
    const componentWidth = shouldStretch ? canvasWidth : COMPONENT_MIN_WIDTH

    if (componentHeight === 0) {
      return {
        componentLeft: 0,
        componentTop: 0,
        componentWidth,
      }
    }

    return {
      componentLeft: shouldStretch ? 0 : round10((canvasWidth - componentWidth) / 2),
      componentTop: round10((canvasHeight - componentHeight) / 2),
      componentWidth,
    }
  }, ['componentHeight', 'shouldStretch', 'canvasWidth', 'canvasHeight']),
  mapInspectRect(),
  mapTransform
)(({
  canvasWidth,
  canvasHeight,
  canvasLeft,
  canvasTop,
  Component,
  componentProps,
  hasGrid,
  transform,
  componentWidth,
  componentLeft,
  componentTop,
  componentHeight,
  setComponentHeight,
  selectedInspectRect,
  setBlockNode,
  plugin,
  theme,
  isCanvasDarkMode,
  isTransforming,
  onMove,
  onWheel,
}) => (
  <SizeBlock shouldHideOverflow>
    <Background color={theme.demoAreaBackgroundColor}/>
    <Pointer onMove={onMove} onWheel={onWheel}>
      <Transform
        x={canvasLeft + transform.x}
        y={canvasTop + transform.y}
        scale={transform.z}
        shouldUse3d={!isSafari}
      >
        <Block
          shouldFlow
          width={canvasWidth}
          height={canvasHeight}
        >
          <Background color={isCanvasDarkMode ? BLACK : WHITE}/>

          {Component && (
            <Transform x={componentLeft} y={componentTop} hOrigin="left" vOrigin="top" shouldUse3d={!isSafari}>
              <Size
                height={componentHeight}
                onHeightChange={setComponentHeight}
              >
                <BlockRef
                  ref={setBlockNode}
                  width={componentWidth}
                  shouldFlow
                >
                  {isDefined(plugin)
                    ? (
                      <plugin.Provider Component={Component} props={componentProps}/>
                    )
                    : (
                      <PureComponent Component={Component} props={componentProps}/>
                    )}
                </BlockRef>
              </Size>
            </Transform>
          )}

          {selectedInspectRect !== null && (
            <Block
              left={selectedInspectRect.left + componentLeft}
              top={selectedInspectRect.top + componentTop}
              width={selectedInspectRect.width}
              height={selectedInspectRect.height}
              shouldIgnorePointerEvents
            >
              <Background color={theme.inspectBackgroundColor}/>
            </Block>
          )}

          {hasGrid && (
            <CanvasGrid
              width={canvasWidth}
              height={canvasHeight}
              shouldDegrade={isTransforming}
              isCanvasDarkMode={isCanvasDarkMode}
            />
          )}
        </Block>
      </Transform>
    </Pointer>
  </SizeBlock>
))

DemoArea.displayName = 'DemoArea'
DemoArea.componentSymbol = SYMBOL_DEMO_AREA
