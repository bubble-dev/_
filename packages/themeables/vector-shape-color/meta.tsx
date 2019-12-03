import React from 'react'
import { TComponentConfig } from 'autoprops'
import { setupVectorShapeTheme, TThemeableVectorShapes } from '@themeables/vector-shape'
import { setupVectorShapeColorTheme, TThemeableVectorShapeColors } from './src'

type Mappings = {
  demo: { status: 'default' | 'error' },
}

const defaultVectorShapeColorTheme: TThemeableVectorShapeColors<Mappings> = {
  demo: ({ status }) => ({
    color: status === 'default' ? [0x00, 0xFF, 0x00, 1] : [0x00, 0x00, 0xFF, 1],
  }),
}

type SimpleMappings = {
  demo: {},
}

const defaultVectorShapeTheme: TThemeableVectorShapes<SimpleMappings> = {
  demo: () => ({
    path: 'M0,30 L0,30 L15,0 L30,30 Z',
    width: 30,
    height: 30,
    color: [0xFF, 0xFF, 0x99, 1],
  }),
}

const { createThemeableVectorShape } = setupVectorShapeTheme(defaultVectorShapeTheme)

const { VectorShapeColorTheme, createThemeableVectorShapeColor } = setupVectorShapeColorTheme<Mappings>(defaultVectorShapeColorTheme)

const DemoThemeableVectorShapeColor = createThemeableVectorShapeColor('demo')

const DemoThemeableVectorShape = createThemeableVectorShape('demo')

type TDemo = { status: 'default' | 'error' }

const newTheme: TThemeableVectorShapeColors<Mappings> = {
  demo: ({ status }) => ({
    color: status === 'default' ? [0xFF, 0x00, 0x00, 1] : [0x00, 0x00, 0x00, 1],
  }),
}

type TDemoComponent = TDemo & { hasTheme: boolean }

export const Component = ({ status, hasTheme }: TDemoComponent) => {
  return (
    hasTheme ? (
      <VectorShapeColorTheme.Provider value={newTheme}>
        <DemoThemeableVectorShapeColor status={status}>
          <DemoThemeableVectorShape/>
        </DemoThemeableVectorShapeColor>
      </VectorShapeColorTheme.Provider>
    ) : (
      <DemoThemeableVectorShapeColor status={status}>
        <DemoThemeableVectorShape/>
      </DemoThemeableVectorShapeColor>
    )
  )
}

Component.displayName = 'ThemeableVectorShapeColor'

export const config: TComponentConfig<TDemoComponent> = {
  props: {
    hasTheme: [true],
    status: ['default', 'error'],
  },
}
