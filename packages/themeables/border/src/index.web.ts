import { createContext, useContext, createElement } from 'react'
import { component, startWithType } from 'refun'
import { Border, TBorder } from '@primitives/border'

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

  const createThemeableBorder = <K extends keyof ComponentMappings>(name: K) => {
    const ThemeableBorder = component(
      startWithType<ComponentMappings[K]>(),
      (props) => ({
        ...useContext(BorderTheme)[name](props),
        ...props,
      })
    )(({
      color,
      topLeftRadius,
      topRightRadius,
      bottomLeftRadius,
      bottomRightRadius,
      topWidth,
      bottomWidth,
      leftWidth,
      rightWidth,
      overflowBottom,
      overflowLeft,
      overflowRight,
      overflowTop,
    }) => (
      createElement(Border,
        {
          color,
          topLeftRadius,
          topRightRadius,
          bottomLeftRadius,
          bottomRightRadius,
          topWidth,
          bottomWidth,
          leftWidth,
          rightWidth,
          overflowBottom,
          overflowLeft,
          overflowRight,
          overflowTop,
        })
    ))

    ThemeableBorder.displayName = `${name}`

    return ThemeableBorder
  }

  return {
    createThemeableBorder,
    BorderTheme,
  }
}
