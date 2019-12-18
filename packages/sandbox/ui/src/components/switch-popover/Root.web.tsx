import React, { ReactNode, Fragment } from 'react'
import { component, startWithType, mapState, mapHandlers } from 'refun'
import { Popover } from '../popover'
import { ButtonIconSwitch } from '../button-icon-switch'
import { mapChildren, SYMBOL_CHILDREN_REST } from '../../map/children'
import { SYMBOL_SWITCH_POPOVER, SYMBOL_ICON, SYMBOL_TOOLTIP } from '../../symbols'

export type TSwitchPopover = {
  width: number,
  children: ReactNode,
}

export const SwitchPopover = component(
  startWithType<TSwitchPopover>(),
  mapState('isOpened', 'setIsOpened', () => false, []),
  mapHandlers({
    onToggle: ({ isOpened, setIsOpened }) => () => {
      setIsOpened(!isOpened)
    },
    onClose: ({ setIsOpened }) => () => {
      setIsOpened(false)
    },
  }),
  mapChildren({
    icon: {
      symbols: [SYMBOL_ICON],
      isRequired: true,
    },
    tooltip: {
      symbols: [SYMBOL_TOOLTIP],
    },
    content: {
      symbols: [SYMBOL_CHILDREN_REST],
    },
  })
)(({
  width,
  isOpened,
  icon,
  tooltip,
  content,
  onToggle,
  onClose,
}) => (
  <Fragment>
    <ButtonIconSwitch
      isChecked={isOpened}
      onToggle={onToggle}
    >
      {icon}
      {tooltip}
    </ButtonIconSwitch>
    {isOpened && (
      <Popover
        width={width}
        onClose={onClose}
      >
        {content}
      </Popover>
    )}
  </Fragment>
))

SwitchPopover.displayName = 'SwitchPopover'
SwitchPopover.componentSymbol = SYMBOL_SWITCH_POPOVER
