import { createContext, useContext, createElement } from 'react'
import { component, startWithType } from 'refun'
import { Image, TImage } from '@primitives/image'

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

  const createThemeableImage = <K extends keyof ComponentMappings>(name: K) => {
    const ThemeableImage = component(
      startWithType<TImage & ComponentMappings[K]>(),
      (props) => ({
        ...useContext(ImageTheme)[name](props),
        ...props,
      })
    )(({
      alt,
      bottomLeftRadius,
      bottomRightRadius,
      height,
      id,
      onError,
      onLoad,
      resizeMode,
      source,
      topLeftRadius,
      topRightRadius,
      width,
    }) => (
      createElement(Image,
        {
          alt,
          bottomLeftRadius,
          bottomRightRadius,
          height,
          id,
          onError,
          onLoad,
          resizeMode,
          source,
          topLeftRadius,
          topRightRadius,
          width,
        })
    ))

    ThemeableImage.displayName = `${name}`

    return ThemeableImage
  }

  return {
    createThemeableImage,
    ImageTheme,
  }
}
