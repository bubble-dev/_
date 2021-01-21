import React from 'react'
import type { HTMLProps } from 'react'
import { normalizeWebStyle } from 'stili'
import { component, startWithType, mapWithProps } from 'refun'
import { isNumber } from 'tsfn'
import type { TStyle } from 'stili'
import type { TProgressBar } from './types'

export const ProgressBar = component(
  startWithType<TProgressBar>(),
  mapWithProps(({ style, id, ariaValuenow, ariaValuemin, ariaValuemax, children }) => {
    const styles: TStyle = {
      display: 'flex',
      flexDirection: 'row',
      borderStyle: 'solid',
      borderWidth: 0,
      position: 'relative',
      alignSelf: 'flex-start',
      flexGrow: 0,
      flexShrink: 0,
      _webOnly: {
        boxSizing: 'border-box',
      },
      ...style,
    }

    const props: HTMLProps<HTMLDivElement> = {
      id,
      children,
    }

    if (isNumber(ariaValuenow)) {
      props['aria-valuenow'] = ariaValuenow
    }

    if (isNumber(ariaValuemin)) {
      props['aria-valuemin'] = ariaValuemin
    }

    if (isNumber(ariaValuemax)) {
      props['aria-valuemax'] = ariaValuemax
    }

    return {
      ...props,
      style: normalizeWebStyle(styles),
    }
  })
)((props) => (
  <div
    role={'progressbar'}
    {...props}
  />
))

ProgressBar.displayName = 'ProgressBar'
