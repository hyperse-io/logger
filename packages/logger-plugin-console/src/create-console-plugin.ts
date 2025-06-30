import type { LogLevel } from '@hyperse/logger';
import { type LoggerContext } from '@hyperse/logger';
import { definePlugin, type LoggerMessage } from '@hyperse/logger';
import { createFormatter } from './helpers/helper-formatter.js';
import type { ConsoleOptions } from './types/type-options.js';

export const createConsolePlugin = (options?: ConsoleOptions) => {
  return definePlugin({
    name: 'console',
    setup: (ctx: LoggerContext, level: LogLevel, message: LoggerMessage) => {
      const formatter = createFormatter(ctx, level, options);
      formatter.print(message);
    },
  });
};
