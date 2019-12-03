import { createContext, useContext, createElement } from 'react'
import { component, startWithType } from 'refun'
import { Background, TBackground } from '@primitives/background'

export type TThemeableBackground = Pick<
TBackground,
| 'bottomLeftRadius'
| 'bottomRightRadius'
| 'color'
| 'topLeftRadius'
| 'topRightRadius'
>

export type TThemeBackground<InputProps> = (props: InputProps) => TThemeableBackground

export type TThemeableBackgrounds<ComponentProps> = {
  [key in keyof ComponentProps]: TThemeBackground<ComponentProps[key]>
}

export const setupBackgroundTheme = <ComponentMappings>(defaultTheme: TThemeableBackgrounds<ComponentMappings>) => {
  const BackgroundTheme = createContext(defaultTheme)

  const createThemeableBackground = <K extends keyof ComponentMappings>(name: K) => {
    const ThemeableBackground = component(
      startWithType<ComponentMappings[K]>(),
      (props) => ({
        ...useContext(BackgroundTheme)[name](props),
        ...props,
      })
    )(({
      color,
      topLeftRadius,
      topRightRadius,
      bottomLeftRadius,
      bottomRightRadius,
    }) => (
      createElement(Background,
        {
          color,
          topLeftRadius,
          topRightRadius,
          bottomLeftRadius,
          bottomRightRadius,
        })
    ))

    ThemeableBackground.displayName = `${name}`

    return ThemeableBackground
  }

  return {
    createThemeableBackground,
    BackgroundTheme,
  }
}
