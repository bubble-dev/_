# @themeables/layout

> What is a _themeable_? You can find more in the [`@themeables` readme](..)

Properties that the theme function for the `@themeables/layout` should return:

```ts
type TThemeableLayout = {
  width?: number,
  height?: number,
}
```

On top of that, the themeable layout component receives these props:

```ts
type TLayout = {
  width?: number,
  height?: number,
  minWidth?: number,
  maxWidth?: number,
  minHeight?: number,
  maxHeight?: number,
  direction: TLayoutDirection,
  vAlign?: TVAlign,
  hAlign?: THAlign,
  children: ReactNode,
}
```

You can see a full example usage in [the meta file](meta.tsx)
