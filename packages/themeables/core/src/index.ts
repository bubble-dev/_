import { createContext, useContext, createElement } from 'react'
import type { FC } from 'react'
import { component, startWithType } from 'refun'

export type TThemeables<ThemeType, ComponentMappings> = { [key in keyof ComponentMappings]: (props: ComponentMappings[key]) => ThemeType }
export type TOverrideables<ThemeType, ComponentMappings> = { [key in keyof ComponentMappings]?: (props: ComponentMappings[key]) => Partial<ThemeType> }
export type TOverrideContext<ThemeType, ComponentMappings> = React.Context<TOverrideables<ThemeType, ComponentMappings>>

export const setupTheme = <ThemeType, ComponentMappings>(
  defaultTheme: TThemeables<ThemeType, ComponentMappings>,
  overrideTheme = {} as TOverrideContext<ThemeType, ComponentMappings>
) => {
  const ThemePiece = createContext(defaultTheme)

  type K = keyof ComponentMappings

  const createThemeable = <P extends ThemeType>(name: K, Target: FC<any>) => {
    const Themeable = component(
      startWithType<Partial<P> & ComponentMappings[K]>(),
      (props) => {
        const themeProps = useContext(ThemePiece)[name](props)
        const overrideCtx = useContext(overrideTheme)

        if (overrideCtx && typeof overrideCtx[name] === 'function') {
          return {
            ...themeProps,
            ...overrideCtx[name]!(props),
            ...props,
          }
        }

        return {
          ...themeProps,
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
