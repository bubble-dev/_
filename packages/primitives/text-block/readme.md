`Text-Block` is a fusion between `Block` and `Text`.

It does not provide all properties each has to offer, it only provides the simplest API possible to deal with content in a `display: block` manner.

As a bonus feature, it can also provide [Leading Control](https://github.com/w3c/csswg-drafts/issues/3240) to the text.

All the styling options of Block are provided as props instead of as an open-ended `style` object.

## Configuration

| Property    | Description                                                           | Type                    |
| ----------- | --------------------------------------------------------------------- | ----------------------- |
| `width`     | Horizontal length of the box                                          | `number`\*              |
| `textAlign` | Text align for the box                                                | `left | center | right` |
| `snapStart` | Leading Control: affects `margin-top` and `padding-top` for the block | `number`\*              |

* will be converted to pixels

## Usage

```tsx

import { TextBlock } from '@primitives/text-block'

export default () => (
  <TextBlock width={500} textAlign="center" snapStart={10}>
    My text in a block
  </TextBlock>
)

```
