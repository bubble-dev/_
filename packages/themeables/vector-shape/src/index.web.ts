import { createContext, useContext, createElement, FC } from 'react'
import { component, startWithType } from 'refun'
import { TVectorShape } from '@primitives/vector-shape'

export type TThemeableVectorShape = Pick<
TVectorShape,
| 'color'
| 'height'
| 'path'
| 'width'
>

export type TThemeVectorShape<InputProps> = (props: InputProps) => TThemeableVectorShape

export type TThemeableVectorShapes<ComponentProps> = {
  [key in keyof ComponentProps]: TThemeVectorShape<ComponentProps[key]>
}

export const setupVectorShapeTheme = <ComponentMappings>(defaultTheme: TThemeableVectorShapes<ComponentMappings>) => {
  const VectorShapeTheme = createContext(defaultTheme)

  type K = keyof ComponentMappings

  const createThemeableVectorShape = <P extends TThemeableVectorShape>(name: K, Target: FC<any>) => {
    const ThemeableVectorShape = component(
      startWithType<Partial<P> & ComponentMappings[K]>(),
      (props) => ({
        ...useContext(VectorShapeTheme)[name](props),
        ...props,
      })
    )((props) => (
      createElement(Target, props)
    ))

    ThemeableVectorShape.displayName = `${name}`

    return ThemeableVectorShape
  }

  return {
    createThemeableVectorShape,
    VectorShapeTheme,
  }
}
