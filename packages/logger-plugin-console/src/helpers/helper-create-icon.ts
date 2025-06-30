import colors from 'picocolors';
import type { Color } from '../types/type-color.js';

export function createIcon(icon: string, iconColor: Color) {
  const iconColorFormatter = colors[iconColor];

  return iconColorFormatter(icon);
}
