import { createContext, useContext, createElement } from 'react'
import { component, startWithType } from 'refun'
import { Text, TText } from '@primitives/text'

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

  const createThemeableText = <K extends keyof ComponentMappings>(name: K) => {
    const ThemeableText = component(
      startWithType<TText & ComponentMappings[K]>(),
      (props) => ({
        ...useContext(TextTheme)[name](props),
        ...props,
      })
    )(({
      id,
      color,
      fontFamily,
      fontWeight,
      fontSize,
      lineHeight,
      letterSpacing,
      isUnderlined,
      shouldPreserveWhitespace,
      shouldPreventWrap,
      shouldPreventSelection,
      shouldHideOverflow,
      children,
    }) => (
      createElement(Text,
        {
          id,
          color,
          fontFamily,
          fontWeight,
          fontSize,
          lineHeight,
          letterSpacing,
          isUnderlined,
          shouldPreserveWhitespace,
          shouldPreventWrap,
          shouldPreventSelection,
          shouldHideOverflow,
          children,
        })
    ))

    ThemeableText.displayName = `${name}`

    return ThemeableText
  }

  return {
    createThemeableText,
    TextTheme,
  }
}
