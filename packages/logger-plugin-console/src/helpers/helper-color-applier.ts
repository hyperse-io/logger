/**
 * Console output formatting with color applier
 * @param colors The colors for the console output
 * @param noColor Removes colors from the console output
 * @returns
 */
export function colorApplier(noColor?: boolean): (text: string) => string {
  return (text: string) => (noColor ? text : `%c${text}%c`);
}
