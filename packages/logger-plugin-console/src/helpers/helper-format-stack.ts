import { terminalColor } from './helper-color-applier.js';

function parseStack(stack: string) {
  const lines = stack
    .split('\n')
    .splice(1)
    .map((l) => l.trim().replace('file://', ''));

  return lines;
}

export const formatStack = (stack: string) =>
  `\n${parseStack(stack)
    .map((line) => `  ${terminalColor(['red'])(line)}`)
    .join('\n')}`;
