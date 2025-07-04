import type colors from 'picocolors';

export type Color = keyof Omit<
  typeof colors,
  'createColors' | 'isColorSupported'
>;
