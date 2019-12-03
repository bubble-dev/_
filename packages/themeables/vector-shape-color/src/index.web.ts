import { createContext, useContext, createElement, ReactNode } from 'react'
import { component, startWithType } from 'refun'
import { TVectorShape } from '@primitives/vector-shape'

export type TThemeableVectorShapeColor = Pick<
TVectorShape,
| 'color'
>

export type TThemeVectorShapeColor<InputProps> = (props: InputProps) => TThemeableVectorShapeColor

export type TThemeableVectorShapeColors<ComponentProps> = {
  [key in keyof ComponentProps]: TThemeVectorShapeColor<ComponentProps[key]>
}

export const VectorShapeColorContext = createContext<TThemeableVectorShapeColor>({})

export const setupVectorShapeColorTheme = <ComponentMappings>(defaultTheme: TThemeableVectorShapeColors<ComponentMappings>) => {
  const VectorShapeColorTheme = createContext(defaultTheme)

  const createThemeableVectorShapeColor = <K extends keyof ComponentMappings>(name: K) => {
    const ThemeableVectorShapeColor = component(
      startWithType<ComponentMappings[K] & { children: ReactNode }>(),
      (props) => ({
        ...useContext(VectorShapeColorTheme)[name](props),
        ...props,
      })
    )(({
      children,
      color,
    }) => (
      createElement(
        VectorShapeColorContext.Provider,
        {
          value: { color },
        },
        children
      )
    ))

    ThemeableVectorShapeColor.displayName = `${name}`

    return ThemeableVectorShapeColor
  }

  return {
    createThemeableVectorShapeColor,
    VectorShapeColorTheme,
  }
}
