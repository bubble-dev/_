import { createContext, useContext, createElement } from 'react'
import { component, startWithType, mapContext } from 'refun'
import { VectorShape, TVectorShape } from '@primitives/vector-shape'
import { VectorShapeColorContext } from '@themeables/vector-shape-color'

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

  const createThemeableVectorShape = <K extends keyof ComponentMappings>(name: K) => {
    const ThemeableVectorShape = component(
      startWithType<Partial<TVectorShape> & ComponentMappings[K]>(),
      (props) => ({
        ...useContext(VectorShapeTheme)[name](props),
        ...props,
      }),
      mapContext(VectorShapeColorContext)
    )(({
      id,
      height,
      path,
      width,
      color,
    }) => (
      createElement(VectorShape,
        { id, height, path, width, color })
    ))

    ThemeableVectorShape.displayName = `${name}`

    return ThemeableVectorShape
  }

  return {
    createThemeableVectorShape,
    VectorShapeTheme,
  }
}
