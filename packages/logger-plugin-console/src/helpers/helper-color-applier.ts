import Picocolors from 'picocolors';
import type { Color } from '../types/type-color.js';

/**
 * Terminal output formatting with ANSI colors
 * @param colors The colors for the console output
 * @param noColor Removes colors from the console output
 * @returns
 */
export function terminalColor(colors: readonly Color[], noColor?: boolean) {
  if (noColor || !colors.length) {
    // Pure text output.
    return (x: string) => x;
  }
  return (x: string) => {
    let out: string = x;
    for (let i = 0; i < colors.length; i++) {
      out = Picocolors[colors[i]](out);
    }
    return out;
  };
}

export const getColorApplier = (
  colorType: 'COLOR' | 'DECORATION',
  levelColors: readonly Color[],
  noColor: boolean
) => {
  const colors = levelColors.filter((colorName) => {
    const isDecoration =
      colorName === 'strikethrough' || colorName === 'underline';

    return colorType === 'DECORATION' ? isDecoration : !isDecoration;
  });

  return terminalColor(colors, noColor);
};
