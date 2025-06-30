import colors from 'picocolors';

function parseStack(stack: string) {
  const lines = stack
    .split('\n')
    .splice(1)
    .map((l) => l.trim().replace('file://', ''));

  return lines;
}

export const formatStack = (stack: string) =>
  `\n${parseStack(stack)
    .map(
      (line) =>
        `  ${line.replace(/^at ([\s\S]+) \((.+)\)/, (_, m1, m2) =>
          colors.gray(`at ${m1} (${colors.cyan(m2)})`)
        )}`
    )
    .join('\n')}`;
