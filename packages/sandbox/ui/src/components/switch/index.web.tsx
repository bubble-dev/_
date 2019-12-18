import React from 'react'
import {
  mapWithProps,
  startWithType,
  mapHovered,
  TMapHovered,
  mapPressed,
  TMapPressed,
  mapKeyboardFocused,
  TMapKeyboardFocused,
  pureComponent,
  mapContext,
} from 'refun'
import { Transform } from '@primitives/transform'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { Block } from '@primitives/block'
import { Background } from '@primitives/background'
import { Border } from '@primitives/border'
import { elegir } from 'elegir'
import { Checkbox } from '../checkbox'
import { SYMBOL_SWITCH } from '../../symbols'
import { SizeBlock } from '../size-block'
import { SwitchThemeContext } from '../theme-provider'
import { TRANSPARENT } from '../theme-provider/colors'

const SWITCH_TIME = 100
const WIDTH = 36
const HEIGHT = 20
const RADIUS = HEIGHT / 2
const KNOB_SIZE = 14
const KNOB_RADIUS = KNOB_SIZE / 2
const KNOB_UNCHECKED_OFFSET = (HEIGHT - KNOB_SIZE) / 2
const KNOB_CHECKED_OFFSET = WIDTH - KNOB_UNCHECKED_OFFSET - KNOB_SIZE
const KNOB_TOP_OFFSET = KNOB_UNCHECKED_OFFSET
const KEYBOARD_BORDER_OFFSET = 4
const KEYBOARD_BORDER_WIDTH = 2
const KEYBOARD_BORDER_RADIUS = RADIUS + KEYBOARD_BORDER_OFFSET

export type TSwitch = {
  isChecked: boolean,
  onToggle: () => void,
} & TMapHovered
  & TMapPressed
  & TMapKeyboardFocused

export const Switch = pureComponent(
  startWithType<TSwitch>(),
  mapContext(SwitchThemeContext),
  mapHovered,
  mapPressed,
  mapKeyboardFocused,
  mapWithProps(({
    isHovered,
    isPressed,
    isKeyboardFocused,
    isChecked,
    backgroundColor,
    activeBackgroundColor,
    hoveredBackgroundColor,
    pressedBackgroundColor,
    activeHoveredBackgroundColor,
    activePressedBackgroundColor,
    focusedOuterBorderColor,
    activeFocusedOuterBorderColor,
    iconColor,
    activeIconColor,
    hoveredIconColor,
    activeHoveredIconColor,
    pressedIconColor,
    activePressedIconColor,
  }) => ({
    leftOffset: isChecked ? KNOB_CHECKED_OFFSET : KNOB_UNCHECKED_OFFSET,
    backgroundColor: elegir(
      isChecked && isPressed,
      activePressedBackgroundColor,
      isPressed,
      pressedBackgroundColor,
      isChecked && isHovered,
      activeHoveredBackgroundColor,
      isHovered,
      hoveredBackgroundColor,
      isChecked,
      activeBackgroundColor,
      true,
      backgroundColor
    ),
    keyboardBorderColor: elegir(
      isChecked && isKeyboardFocused,
      activeFocusedOuterBorderColor,
      isKeyboardFocused,
      focusedOuterBorderColor,
      true,
      TRANSPARENT
    ),
    knobColor: elegir(
      isChecked && isPressed,
      activePressedIconColor,
      isPressed,
      pressedIconColor,
      isChecked && isHovered,
      activeHoveredIconColor,
      isHovered,
      hoveredIconColor,
      isChecked,
      activeIconColor,
      true,
      iconColor
    ),
  }))
)(({
  leftOffset,
  isChecked,
  knobColor,
  backgroundColor,
  keyboardBorderColor,
  onToggle,
  onFocus,
  onBlur,
  onPressIn,
  onPressOut,
  onPointerEnter,
  onPointerLeave,
}) => (
  <SizeBlock width={WIDTH} height={HEIGHT}>
    <Checkbox
      onToggle={onToggle}
      isChecked={isChecked}
      onFocus={onFocus}
      onBlur={onBlur}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <Background
        topLeftRadius={RADIUS}
        topRightRadius={RADIUS}
        bottomLeftRadius={RADIUS}
        bottomRightRadius={RADIUS}
        color={backgroundColor}
      />
      <Border
        topLeftRadius={KEYBOARD_BORDER_RADIUS}
        topRightRadius={KEYBOARD_BORDER_RADIUS}
        bottomLeftRadius={KEYBOARD_BORDER_RADIUS}
        bottomRightRadius={KEYBOARD_BORDER_RADIUS}
        color={keyboardBorderColor}
        topWidth={KEYBOARD_BORDER_WIDTH}
        bottomWidth={KEYBOARD_BORDER_WIDTH}
        leftWidth={KEYBOARD_BORDER_WIDTH}
        rightWidth={KEYBOARD_BORDER_WIDTH}
        overflowTop={KEYBOARD_BORDER_OFFSET}
        overflowLeft={KEYBOARD_BORDER_OFFSET}
        overflowRight={KEYBOARD_BORDER_OFFSET}
        overflowBottom={KEYBOARD_BORDER_OFFSET}
      />
      <Animation values={[leftOffset]} time={SWITCH_TIME} easing={easeInOutCubic}>
        {([x]) => (
          <Transform x={x}>
            <Block top={KNOB_TOP_OFFSET} width={KNOB_SIZE} height={KNOB_SIZE}>
              <Background
                topLeftRadius={KNOB_RADIUS}
                topRightRadius={KNOB_RADIUS}
                bottomLeftRadius={KNOB_RADIUS}
                bottomRightRadius={KNOB_RADIUS}
                color={knobColor}
              />
            </Block>
          </Transform>
        )}
      </Animation>
    </Checkbox>
  </SizeBlock>
))

Switch.displayName = 'Switch'
Switch.componentSymbol = SYMBOL_SWITCH
