import { createContext, useContext, createElement, FC } from 'react'
import { component, startWithType } from 'refun'
import { TText } from '@primitives/text'

export type TThemeableText = Pick<
TText,
| 'color'
| 'fontFamily'
| 'fontSize'
| 'fontWeight'
| 'lineHeight'
| 'letterSpacing'
| 'isUnderlined'
>

export type TThemeText<InputProps> = (props: InputProps) => TThemeableText

export type TThemeableTexts<ComponentProps> = {
  [key in keyof ComponentProps]: TThemeText<ComponentProps[key]>
}

export const setupTextTheme = <ComponentMappings>(defaultTheme: TThemeableTexts<ComponentMappings>) => {
  const TextTheme = createContext(defaultTheme)

  type K = keyof ComponentMappings

  const createThemeableText = <P extends TThemeableText>(name: K, Target: FC<any>) => {
    const ThemeableText = component(
      startWithType<Partial<P> & ComponentMappings[K]>(),
      (props) => ({
        ...useContext(TextTheme)[name](props),
        ...props,
      })
    )((props) => (
      createElement(Target, props)
    ))

    ThemeableText.displayName = `${name}`

    return ThemeableText
  }

  return {
    createThemeableText,
    TextTheme,
  }
}
