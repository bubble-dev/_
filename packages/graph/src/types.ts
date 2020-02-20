import { ChangeEvent } from 'react'
import { TColor } from 'colorido'
import { TMapHovered } from 'refun'

export type TEntry = {
  version: string,
  value: number,
  release: string,
}

export type TGraph = {
  key: string,
  colors: [TColor, TColor],
  values: TEntry[],
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

export type TGraphControl = {
  colors: [TColor, TColor],
  key: string,
  lastDifference: number,
  name: string,
}

export type TButton = {
  idKey: string,
  selectedGraph: string | null,
  onSelectGraph: (key: string | null) => void,
} & TGraphControl

export type TCanvas = {
  graphs: TGraph[],
  height: number,
  hoveredGraph: string | null,
  scale: number,
  selectedGraph: string | null,
  width: number,
  onHoverGraph: (key: string | null) => void,
  onSelectGraph: (key: string | null) => void,
  onSliderChange: (event: ChangeEvent<HTMLInputElement>) => void,
}

export type TControls = {
  graphControls: TGraphControl[],
  selectedGraph: string | null,
  onSelectGraph: (key: string | null) => void,
}

export type TGraphItem = {
  colors: TColor[],
  entries: TEntry[],
  id: string,
  isActive: boolean,
  rect: TRect,
  scale: number,
  shouldShowDots: boolean,
  onHover: (key: string | null) => void,
  onSelect: (key: string) => void,
}

export type TApp = {
  graphs: TGraph[],
}

export type TGraphPoint = {
  fill: TColor,
  isLast: boolean,
  release: string,
  shouldShowDots: boolean,
  value: number,
  valueDifference: number,
  x: number,
  y: number,
} & TMapHovered
