export type TThemeableLayout = {
  height?: number,
  width?: number,
}

export type TThemeLayout<InputProps> = (props: InputProps) => TThemeableLayout

export type TThemeableLayouts<ComponentProps> = {
  [key in keyof ComponentProps]: TThemeLayout<ComponentProps[key]>
}

