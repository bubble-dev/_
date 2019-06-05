export type WithAlpha = {
  alpha: number,
}

export type RGB = {
  red: number,
  green: number,
  blue: number,
}

export type RGBA = RGB & WithAlpha

export type HSV = {
  hue: number,
  saturation: number,
  value: number,
}

export type HSVA = HSV & WithAlpha

export type HCL = {
  hue: number,
  chroma: number,
  luminance: number,
}

export type HCLA = HCL & WithAlpha

export type LAB = {
  luminance: number,
  a: number,
  b: number,
}

export type LABA = LAB & WithAlpha
