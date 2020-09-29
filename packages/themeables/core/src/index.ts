import { createContext, useContext, createElement } from 'react'
import type { FC } from 'react'
import { component, startWithType } from 'refun'

export type TThemeables<ThemeType, ComponentMappings> = { [key in keyof ComponentMappings]: (props: ComponentMappings[key]) => ThemeType }
export type TOverrideables<ThemeType, ComponentMappings> = { [key in keyof ComponentMappings]?: (props: ComponentMappings[key]) => Partial<ThemeType> }
export type TOverrideContext<ThemeType, ComponentMappings> = React.Context<TOverrideables<ThemeType, ComponentMappings>>

export const setupTheme = <ThemeType, ComponentMappings>(
  defaultTheme: TThemeables<ThemeType, ComponentMappings>,
  overrideTheme?: TOverrideContext<ThemeType, ComponentMappings>
) => {
  const ThemePiece = createContext(defaultTheme)

  type K = keyof ComponentMappings

  const createThemeable = <P extends ThemeType>(name: K, Target: FC<any>) => {
    const Themeable = component(
      startWithType<Partial<P> & ComponentMappings[K]>(),
      (props) => {
        const themeProps = useContext(ThemePiece)[name](props)
        let overrides = {}

        if (overrideTheme
          && useContext(overrideTheme)
          && useContext(overrideTheme)[name]
          && typeof useContext(overrideTheme)[name] === 'function'
        ) {
          overrides = useContext(overrideTheme)[name]!(props)
        }

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
