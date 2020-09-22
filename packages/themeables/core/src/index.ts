import { createContext, useContext, createElement } from 'react'
import type { FC } from 'react'
import { component, startWithType } from 'refun'

export type TThemeables<ThemeType, ComponentMappings> = { [key in keyof ComponentMappings]: (props: ComponentMappings[key]) => ThemeType }

export const setupTheme = <ThemeType, ComponentMappings>(
  defaultTheme: TThemeables<ThemeType, ComponentMappings>,
  overrideTheme?: React.Context<TThemeables<ThemeType, ComponentMappings>>,
) => {
  const ThemePiece = createContext(defaultTheme)

  type K = keyof ComponentMappings

  const createThemeable = <P extends ThemeType>(name: K, Target: FC<any>) => {
    const Themeable = component(
      startWithType<Partial<P> & ComponentMappings[K]>(),
      (props) => {
        const themeProps = useContext(ThemePiece)[name](props)

        const overrides = overrideTheme && useContext(overrideTheme) && useContext(overrideTheme)[name] && useContext(overrideTheme)[name](props) || {}

        return {
          ...themeProps,
          ...overrides,
          ...props,
        }
      }
    )((props) => createElement(Target, props))

    const matched = name.toString().match(/^Symbol\((.+)\)$/)

    Themeable.displayName = matched?.[1] ?? `${name}`

    return Themeable
  }

  return {
    createThemeable,
    ThemePiece,
  }
}
