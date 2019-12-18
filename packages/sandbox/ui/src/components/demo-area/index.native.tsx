import React, { FC } from 'react'
import {
  mapWithProps,
  startWithType,
  mapDebouncedHandlerTimeout,
  pureComponent,
  mapState,
  mapHandlers,
  mapWithPropsMemo,
  mapContext,
} from 'refun'
import { Transform } from '@primitives/transform'
import { Size } from '@primitives/size'
import { Background } from '@primitives/background'
import { TAnyObject } from 'tsfn'
import { Block } from '../block'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { CanvasGrid } from '../canvas-grid'
import { TTransform } from '../../types'
import { setTransform } from '../../actions'
import { LayoutContext } from '../layout-context'
import { ThemeContext } from '../theme-provider'
import { SizeBlock } from '../size-block'
import { BLACK, WHITE } from '../theme-provider/colors'
import { mapTransform } from './map-transform'
import { PureComponent } from './pure-component'

const COMPONENT_MIN_WIDTH = 200
const round10 = (num: number) => Math.round(num / 10) * 10

export type TDemoArea = {
  Component?: FC<any>,
  componentProps?: Readonly<TAnyObject>,
}

export const DemoArea = pureComponent(
  startWithType<TDemoArea>(),
  mapContext(ThemeContext),
  mapContext(LayoutContext),
  mapStoreState(({ width, height, hasGrid, shouldStretch, isCanvasDarkMode, transformX, transformY, transformZ }) => ({
    canvasWidth: width,
    canvasHeight: height,
    shouldStretch,
    hasGrid,
    isCanvasDarkMode,
    transform: {
      x: transformX,
      y: transformY,
      z: transformZ,
    },
  }), ['width', 'height', 'hasGrid', 'shouldStretch', 'isCanvasDarkMode', 'transformX', 'transformY', 'transformZ']),
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
        componentWidth: COMPONENT_MIN_WIDTH,
      }
    }

    return {
      componentLeft: shouldStretch ? 0 : round10((canvasWidth - componentWidth) / 2),
      componentTop: round10((canvasHeight - componentHeight) / 2),
      componentWidth,
    }
  }, ['componentHeight', 'shouldStretch', 'canvasWidth', 'canvasHeight']),
  mapTransform(0, 0)
)(({
  canvasWidth,
  canvasHeight,
  canvasLeft,
  canvasTop,
  Component,
  componentProps,
  hasGrid,
  transform,
  isTransforming,
  componentWidth,
  componentLeft,
  componentTop,
  componentHeight,
  setComponentHeight,
  theme,
  isCanvasDarkMode,
}) => (
  <SizeBlock shouldHideOverflow>
    <Background color={theme.demoAreaBackgroundColor}/>
    <Transform
      shouldUse3d
      x={canvasLeft + transform.x}
      y={canvasTop + transform.y}
      scale={transform.z}
    >
      <Block
        shouldFlow
        width={canvasWidth}
        height={canvasHeight}
      >
        <Background color={isCanvasDarkMode ? BLACK : WHITE}/>

        {Component && (
          <Block width={componentWidth}>
            <Transform x={componentLeft} y={componentTop} hOrigin="left" vOrigin="top" shouldUse3d>
              <Size
                height={componentHeight}
                onHeightChange={setComponentHeight}
              >
                <PureComponent Component={Component} props={componentProps}/>
              </Size>
            </Transform>
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
  </SizeBlock>
))

DemoArea.displayName = 'DemoArea'
