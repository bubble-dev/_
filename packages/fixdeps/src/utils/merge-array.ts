export const mergeArray = (a: string[], b: string[]): string[] =>
  Array.from(new Set(a.concat(b)))
