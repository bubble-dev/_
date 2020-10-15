import { createContext, useContext, createElement } from 'react'
import type { FC } from 'react'
import { component, startWithType } from 'refun'

export type TThemeables<ThemeType, ComponentMappings> = { [key in keyof ComponentMappings]?: (props: ComponentMappings[key]) => Partial<ThemeType> }

export const setupTheme = <ThemeType>() => {
  const ThemePiece = createContext({})

  const createThemeable = <P extends ThemeType, ThemeType, ComponentMappings>(
    name: keyof ComponentMappings,
    Target: FC<any>,
    overrideTheme = {} as React.Context<TThemeables<ThemeType, ComponentMappings>>
  ) => {
    const Themeable = component(
      startWithType<Partial<P> & ComponentMappings[keyof ComponentMappings]>(),
      (props) => {
        let themeProps = {}
        let overrideProps = {}


        const themeContext = useContext(ThemePiece as React.Context<TThemeables<ThemeType, ComponentMappings>>)
        const overridesContext = useContext(overrideTheme || {})

        if (themeContext && typeof themeContext[name] === 'function') {
          themeProps = themeContext[name]!(props)
        }

        if (overridesContext && typeof overridesContext[name] === 'function') {
          overrideProps = overridesContext[name]!(props)
        }

        return {
          ...themeProps,
          ...overrideProps,
          ...props,
        }
      }
    )((props) => createElement(Target, props))

    return Themeable
  }

  return {
    createThemeable,
    ThemePiece,
  }
}
