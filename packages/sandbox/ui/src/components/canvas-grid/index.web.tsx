import React from 'react'
import { startWithType, mapWithProps, pureComponent, mapWithPropsMemo, mapDefaultProps } from 'refun'
import { elegir } from 'elegir'
import { Surface, Group, Shape } from '@primitives/svg'
import { PrimitiveBlock } from '../primitive-block'
import * as Colors from './colors'
import { TCanvasGrid } from './types'

const CANVAS_GRID_SIZE = 5

export const CanvasGrid = pureComponent(
  startWithType<TCanvasGrid>(),
  mapDefaultProps({
    gridSize: CANVAS_GRID_SIZE,
  }),
  mapWithPropsMemo(({ width, height, gridSize }) => ({
    horizontalPositions: Array(Math.ceil(height / gridSize) + 1)
      .fill(0)
      .map((_, i) => i * gridSize),
    verticalPositions: Array(Math.ceil(width / gridSize) + 1)
      .fill(0)
      .map((_, i) => i * gridSize),
  }), ['width', 'height']),
  mapWithProps(({ shouldDegrade, isCanvasDarkMode }) => ({
    color: elegir(
      shouldDegrade && isCanvasDarkMode,
      Colors.GRID_COLOR_DEGRADE_DARK,
      shouldDegrade,
      Colors.GRID_COLOR_DEGRADE,
      isCanvasDarkMode,
      Colors.GRID_COLOR_DARK,
      true,
      Colors.GRID_COLOR
    ),
    colorSoft: elegir(
      shouldDegrade && isCanvasDarkMode,
      Colors.GRID_COLOR_DEGRADE_SOFT_DARK,
      shouldDegrade,
      Colors.GRID_COLOR_DEGRADE_SOFT,
      isCanvasDarkMode,
      Colors.GRID_COLOR_SOFT_DARK,
      true,
      Colors.GRID_COLOR_SOFT
    ),
  }))
)(({ horizontalPositions, verticalPositions, width, height, color, colorSoft, shouldDegrade }) => (
  <PrimitiveBlock shouldIgnorePointerEvents top={0} left={0} blendMode={shouldDegrade ? 'initial' : 'difference'}>
    <Surface height={height} width={width}>
      <Group>
        {horizontalPositions.map((position, i) => (
          i % 2 === 1 && (
            <Shape
              key={position}
              d={`M0,${position} ${width},${position}`}
              stroke={colorSoft}
              strokeWidth={0.5}
            />
          )
        ))}
      </Group>
      <Group>
        {verticalPositions.map((position, i) => (
          i % 2 === 1 && (
            <Shape
              key={position}
              d={`M${position},0 ${position},${height}`}
              stroke={colorSoft}
              strokeWidth={0.5}
            />
          )
        ))}
      </Group>
      <Group>
        {horizontalPositions.map((position, i) => (
          i % 2 === 0 && (
            <Shape
              key={position}
              d={`M0,${position} ${width},${position}`}
              stroke={color}
              strokeWidth={0.5}
            />
          )
        ))}
      </Group>
      <Group>
        {verticalPositions.map((position, i) => (
          i % 2 === 0 && (
            <Shape
              key={position}
              d={`M${position},0 ${position},${height}`}
              stroke={color}
              strokeWidth={0.5}
            />
          )
        ))}
      </Group>
    </Surface>
  </PrimitiveBlock>
))

CanvasGrid.displayName = 'Grid'
