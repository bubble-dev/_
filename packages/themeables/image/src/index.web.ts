import { createContext, useContext, createElement, FC } from 'react'
import { component, startWithType } from 'refun'
import { TImage } from '@primitives/image'

export type TThemeableImage = Pick<
TImage,
| 'resizeMode'
>

export type TThemeImage<InputProps> = (props: InputProps) => TThemeableImage

export type TThemeableImages<ComponentProps> = {
  [key in keyof ComponentProps]: TThemeImage<ComponentProps[key]>
}

export const setupImageTheme = <ComponentMappings>(defaultTheme: TThemeableImages<ComponentMappings>) => {
  const ImageTheme = createContext(defaultTheme)

  type K = keyof ComponentMappings

  const createThemeableImage = <P extends TThemeableImage>(name: K, Target: FC<any>) => {
    const ThemeableImage = component(
      startWithType<Partial<P> & ComponentMappings[K]>(),
      (props) => ({
        ...useContext(ImageTheme)[name](props),
        ...props,
      })
    )((props) => (
      createElement(Target, props)
    ))

    ThemeableImage.displayName = `${name}`

    return ThemeableImage
  }

  return {
    createThemeableImage,
    ImageTheme,
  }
}
