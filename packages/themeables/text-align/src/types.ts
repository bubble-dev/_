import { TAlign, TDirection } from '@primitives/paragraph'

export type TThemeableTextAlign = {
  align?: TAlign,
  direction?: TDirection,
}

export type TThemeTextAlign<InputProps> = (props: InputProps) => TThemeableTextAlign

export type TThemeableTextAligns<ComponentProps> = {
  [key in keyof ComponentProps]: TThemeTextAlign<ComponentProps[key]>
}

