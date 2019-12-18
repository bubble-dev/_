import React from 'react'
import { mapHovered, TMapHovered, component, mapHandlers, startWithType, mapWithProps, mapContext, onChange, mapPressed, TMapPressed, TMapKeyboardFocused, mapKeyboardFocused } from 'refun'
import { isDefined } from 'tsfn'
import { TLine as TSyntxLine } from 'syntx'
import { Button } from '@primitives/button'
import { Background } from '@primitives/background'
import { elegir } from 'elegir'
import { Block } from '../block'
import { mapStoreDispatch } from '../../store'
import { selectElement } from '../../actions'
import { TTheme } from '../../types'
import { LayoutContext } from '../layout-context'
import { Size } from '../size'
import { TRANSPARENT } from '../theme-provider/colors'
import { Text } from './Text'
import { LineElement } from './LineElement'
import { CollapseIcon } from './CollapseIcon'

const LINE_HEIGHT = 20
const LINE_PADDING_LEFT = 70
const LINE_PADDING_RIGHT = 30

export type TLine = {
  index: number,
  line: TSyntxLine,
  lineWidth: number,
  theme: TTheme,
  isCollapsed: boolean,
  isCollapsible: boolean,
  onCollapse: (meta?: any) => void,
  selectedElementPath: string,
} & TMapHovered
  & TMapPressed
  & TMapKeyboardFocused

export const Line = component(
  startWithType<TLine>(),
  mapContext(LayoutContext),
  onChange(({ _onHeightChange }) => {
      _onHeightChange?.(LINE_HEIGHT)
  }, []),
  mapStoreDispatch,
  mapHovered,
  mapPressed,
  mapKeyboardFocused,
  mapWithProps(({
    line,
    theme,
    isHovered,
    isPressed,
    isKeyboardFocused,
    selectedElementPath,
  }) => {
    const isActive = line.meta === selectedElementPath

    return ({
      backgroundColor: elegir(
        isActive && isPressed,
        theme.sourceCodeActivePressedLineBackgroundColor,
        isPressed,
        theme.sourceCodePressedLineBackgroundColor,
        isActive && isHovered,
        theme.sourceCodeActiveHoveredLineBackgroundColor,
        isHovered,
        theme.sourceCodeHoveredLineBackgroundColor,
        isActive,
        theme.sourceCodeActiveLineBackgroundColor,
        true,
        theme.sourceCodeLineBackgroundColor
      ),
      lineColor: elegir(
        isActive,
        theme.sourceCodeActiveLineColor,
        true,
        theme.sourceCodeLineColor
      ),
      lineFocusedBorderColor: elegir(
        isKeyboardFocused && isActive,
        theme.sourceCodeActiveLineColor,
        isKeyboardFocused,
        theme.sourceCodeLineColor,
        true,
        TRANSPARENT
      ),
    })
  }),
  mapHandlers({
    onPress: ({ dispatch, line }) => () => {
      if (isDefined(line.meta)) {
        dispatch(selectElement(line.meta))
      }
    },
    onCollapse: ({ onCollapse, line }) => () => {
      onCollapse(line.meta)
    },
  })
)(({
  _left,
  _top,
  _width,
  _onWidthChange,
  line,
  lineWidth,
  index,
  backgroundColor,
  lineColor,
  lineFocusedBorderColor,
  theme,
  isCollapsible,
  isCollapsed,
  onCollapse,
  onPointerEnter,
  onPointerLeave,
  onPressIn,
  onPressOut,
  onPress,
  onFocus,
  onBlur,
}) => (
  <Block left={_left} top={_top} width={lineWidth + LINE_PADDING_LEFT + LINE_PADDING_RIGHT} height={LINE_HEIGHT}>
    <Background color={backgroundColor}/>

    <Button
      onPress={onPress}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <Size left={LINE_PADDING_LEFT} width={_width} onWidthChange={_onWidthChange}>
        <Block shouldFlow>
          {line.elements.map(({ type, value }, i) => (
            <LineElement
              key={i}
              type={type}
              theme={theme}
            >
              {value}
            </LineElement>
          ))}
        </Block>
      </Size>
    </Button>

    <Block left={20} shouldIgnorePointerEvents>
      <Text color={lineColor}>
        {String(index + 1).padStart(2, '0')}
      </Text>
      <Block left={0} right={0} bottom={0} height={2}>
        <Background color={lineFocusedBorderColor}/>
      </Block>
    </Block>
    {isCollapsible && (
      <Block top={4} left={50}>
        <CollapseIcon isCollapsed={isCollapsed} onPress={onCollapse}/>
      </Block>
    )}
  </Block>
))

Line.displayName = 'Line'
Line.componentSymbol = Symbol('SOURCE_CODE_LINE')
