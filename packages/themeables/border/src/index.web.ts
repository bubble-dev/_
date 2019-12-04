import { createContext, useContext, createElement, FC } from 'react'
import { component, startWithType } from 'refun'
import { TBorder } from '@primitives/border'

export type TThemeableBorder = Pick<
TBorder,
| 'bottomLeftRadius'
| 'bottomRightRadius'
| 'bottomWidth'
| 'color'
| 'leftWidth'
| 'overflowBottom'
| 'overflowLeft'
| 'overflowRight'
| 'overflowTop'
| 'rightWidth'
| 'topLeftRadius'
| 'topRightRadius'
| 'topWidth'
>

export type TThemeBorder<InputProps> = (props: InputProps) => TThemeableBorder

export type TThemeableBorders<ComponentProps> = {
  [key in keyof ComponentProps]: TThemeBorder<ComponentProps[key]>
}

export const setupBorderTheme = <ComponentMappings>(defaultTheme: TThemeableBorders<ComponentMappings>) => {
  const BorderTheme = createContext(defaultTheme)

  type K = keyof ComponentMappings

  const createThemeableBorder = <P extends TThemeableBorder>(name: K, Target: FC<any>) => {
    const ThemeableBorder = component(
      startWithType<Partial<P> & ComponentMappings[K]>(),
      (props) => ({
        ...useContext(BorderTheme)[name](props),
        ...props,
      })
    )((props) => (
      createElement(Target, props)
    ))

    ThemeableBorder.displayName = `${name}`

    return ThemeableBorder
  }

  return {
    createThemeableBorder,
    BorderTheme,
  }
}
