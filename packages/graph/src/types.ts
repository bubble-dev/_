export type TEntry = {
  version: string,
  value: number,
}

export type TGraphValue = {
  version: string,
  value: number,
}

export type TGraph = {
  key: string,
  color: string,
  values: TGraphValue[],
}

export type TPoint = {
  x: number,
  y: number,
}

export type TRect = {
  x: number,
  y: number,
  width: number,
  height: number,
}
