import { useContext, createElement } from 'react'
import type { FC } from 'react'
import { component, startWithType } from 'refun'

export type TThemeables<ThemeType, ComponentMappings> = { [key in keyof ComponentMappings]?: (props: ComponentMappings[key]) => Partial<ThemeType> }

export const createThemeable = <P extends ThemeType, ThemeType, ComponentMappings>(
  name: keyof ComponentMappings,
  Target: FC<any>,
  theme: React.Context<TThemeables<ThemeType, ComponentMappings>>,
  overrides?: React.Context<TThemeables<ThemeType, ComponentMappings>>
) => {
  const Themeable = component(
    startWithType<Partial<P> & ComponentMappings[keyof ComponentMappings]>(),
    (props) => {
      let themeProps = {}
      let overrideProps = {}

      if (theme
        && useContext(theme)
        && useContext(theme)[name]
        && typeof useContext(theme)[name] === 'function'
      ) {
        themeProps = useContext(theme)[name]!(props)
      }

      if (overrides
        && useContext(overrides)
        && useContext(overrides)[name]
        && typeof useContext(overrides)[name] === 'function'
      ) {
        overrideProps = useContext(overrides)[name]!(props)
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
