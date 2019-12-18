import React, { ReactNode, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { component, startWithType, mapContext, mapState, mapWithProps, mapDefaultProps, onMount } from 'refun'
import { Background } from '@primitives/background'
import { Button } from '@primitives/button'
import { Animation, easeLinear } from '@primitives/animation'
import { PortalContext } from '../portal-provider'
import { LayoutContext } from '../layout-context'
import { RootContext } from '../root'
import { Block } from '../block'
import { IconArrowUp } from '../icons/arrow-up'
import { IconArrowDown } from '../icons/arrow-down'
import { mapContextOverride, TextThemeContext, PopoverThemeContext } from '../theme-provider'

const POPOVER_ANIMATION_TIME = 200
const POPOVER_H_PADDING = 20
const POPOVER_V_PADDING = 10
const ARROW_H_OFFSET = 20
const ARROW_V_OFFSET = 10
const ARROW_HALF_WIDTH = 10
const POPOVER_V_OFFSET = 10

export type TPopover = {
  width: number,
  hPadding?: number,
  vPadding?: number,
  arrowPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left',
  children: ReactNode,
  onClose?: () => void,
}

export const Popover = component(
  startWithType<TPopover>(),
  mapContext(PortalContext),
  mapContext(LayoutContext),
  mapContext(RootContext),
  mapContext(PopoverThemeContext),
  mapDefaultProps({
    arrowPosition: 'bottom-left',
    hPadding: POPOVER_H_PADDING,
    vPadding: POPOVER_V_PADDING,
  }),
  mapContextOverride('ArrowIconThemeProvider', TextThemeContext, ({ backgroundColor }) => ({
    color: backgroundColor,
  })),
  mapState('isOpen', 'setIsOpen', () => false, []),
  onMount(({ setIsOpen }) => {
    setIsOpen(true)
  }),
  mapState('contentHeight', 'setContentHeight', () => 0, ['width']),
  mapWithProps(({ _x, _y, _width, arrowPosition, width, _height, contentHeight, hPadding, vPadding }) => {
    const height = contentHeight + vPadding * 2
    const contentWidth = width - hPadding * 2
    const centerX = _x + _width / 2

    switch (arrowPosition) {
      case 'top-right': {
        return {
          arrowLeft: width - ARROW_H_OFFSET - ARROW_HALF_WIDTH,
          arrowTop: -ARROW_V_OFFSET,
          x: centerX - width + ARROW_H_OFFSET,
          y: _y + _height + ARROW_V_OFFSET + POPOVER_V_OFFSET,
          width,
          height,
          contentWidth,
        }
      }
      case 'top-left': {
        return {
          arrowLeft: ARROW_H_OFFSET - ARROW_HALF_WIDTH,
          arrowTop: -ARROW_V_OFFSET,
          x: centerX - ARROW_H_OFFSET,
          y: _y + _height + ARROW_V_OFFSET + POPOVER_V_OFFSET,
          width,
          height,
          contentWidth,
        }
      }
      case 'bottom-right': {
        return {
          arrowLeft: width - ARROW_H_OFFSET - ARROW_HALF_WIDTH,
          arrowTop: height - ARROW_HALF_WIDTH,
          x: centerX - width + ARROW_H_OFFSET,
          y: _y - height - ARROW_V_OFFSET - POPOVER_V_OFFSET,
          width,
          height,
          contentWidth,
        }
      }
      case 'bottom-left': {
        return {
          arrowLeft: ARROW_H_OFFSET - ARROW_HALF_WIDTH,
          arrowTop: height - ARROW_HALF_WIDTH,
          x: centerX - ARROW_H_OFFSET,
          y: _y - height - ARROW_V_OFFSET - POPOVER_V_OFFSET,
          width,
          height,
          contentWidth,
        }
      }
    }
  })
)(({
  x,
  y,
  _rootWidth,
  _rootHeight,
  width,
  height,
  contentWidth,
  contentHeight,
  setContentHeight,
  arrowLeft,
  arrowTop,
  arrowPosition,
  hPadding,
  vPadding,
  portalElement,
  children,
  backgroundColor,
  ArrowIconThemeProvider,
  isOpen,
  onClose,
}) => {
  if (portalElement === null) {
    return null
  }

  return createPortal(
    (
      <Fragment>
        <Block
          left={0}
          top={0}
          width={_rootWidth}
          height={_rootHeight}
        >
          <Button onPress={onClose}/>
        </Block>
        <Animation values={[isOpen ? 1 : 0]} easing={easeLinear} time={POPOVER_ANIMATION_TIME}>
          {([opacity]) => (
            <Block
              left={x}
              top={y}
              width={width}
              height={height}
              opacity={opacity}
            >
              <Background color={backgroundColor}/>
              <Block left={arrowLeft} top={arrowTop}>
                <ArrowIconThemeProvider>
                  {arrowPosition === 'top-right' || arrowPosition === 'top-left'
                    ? <IconArrowUp/>
                    : <IconArrowDown/>
                  }
                </ArrowIconThemeProvider>
              </Block>
              <LayoutContext.Provider
                value={{
                  _x: x + hPadding,
                  _y: y + vPadding,
                  _parentLeft: 0,
                  _parentTop: 0,
                  _parentWidth: width,
                  _parentHeight: height,
                  _left: hPadding,
                  _top: vPadding,
                  _width: contentWidth,
                  _height: contentHeight,
                  _onHeightChange: setContentHeight,
                }}
              >
                {children}
              </LayoutContext.Provider>
            </Block>
          )}
        </Animation>
      </Fragment>
    ),
    portalElement
  )
})

Popover.displayName = 'Popover'
