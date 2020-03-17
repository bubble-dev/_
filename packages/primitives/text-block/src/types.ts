import { TText } from '@primitives/text'

// React Native does not support `text-align: justify`
type supportedTextAlign = 'left' | 'right' | 'center'

export type TBlockProps = {
  width?: number,
  marginTop?: number,
  paddingTop?: number,
  textAlign?: supportedTextAlign,
}

export type TTextBlock = {
  width?: number,
  snapStart?: number,
  textAlign?: supportedTextAlign,
} & TText
