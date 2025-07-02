function parseStack(stack: string) {
  if (!stack || typeof stack !== 'string') {
    return [];
  }
  const lines = stack
    .split('\n')
    .splice(1)
    .map((l) => l.trim().replace('file://', ''));

  return lines;
}

export const formatStack = (stack: string) =>
  `\n${parseStack(stack)
    .map((line) => `  ${line}`)
    .join('\n')}`;
