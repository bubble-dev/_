import type { TColor } from 'colorido'

export type TThemeableVectorShape = {
  color?: TColor,
  height?: number,
  path?: string,
  scale?: number,
  width?: number,
}

export type TThemeVectorShape<InputProps> = (props: InputProps) => TThemeableVectorShape

export type TThemeableVectorShapes<ComponentProps> = {
  [key in keyof ComponentProps]: TThemeVectorShape<ComponentProps[key]>
}
