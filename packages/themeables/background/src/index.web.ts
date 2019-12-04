import { createContext, useContext, createElement, FC } from 'react'
import { component, startWithType } from 'refun'
import { TBackground } from '@primitives/background'

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

  type K = keyof ComponentMappings

  const createThemeableBackground = <P extends TThemeableBackground>(name: K, Target: FC<any>) => {
    const ThemeableBackground = component(
      startWithType<Partial<P> & ComponentMappings[K]>(),
      (props) => ({
        ...useContext(BackgroundTheme)[name](props),
        ...props,
      })
    )((props) => createElement(Target, props))

    ThemeableBackground.displayName = `${name}`

    return ThemeableBackground
  }

  return {
    createThemeableBackground,
    BackgroundTheme,
  }
}
