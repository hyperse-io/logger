import colors from 'picocolors';
import type { Color } from '../types/type-color.js';

export function createContext(badgeType: string, bgColor: Color) {
  const bgColorFormatter = colors[bgColor];

  return colors.bold(bgColorFormatter(`[${badgeType}]`));
}
