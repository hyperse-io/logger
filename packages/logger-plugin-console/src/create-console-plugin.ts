import { definePlugin } from '@hyperse/logger';
import { assertMessage } from './helpers/helper-assert-message.js';
import { formatMessage } from './helpers/helper-format-message.js';
import { mergeConsoleOptions } from './helpers/helper-merge-optons.js';
import type { ConsoleOptions } from './types/type-options.js';
import type {
  ConsolePluginContext,
  ConsolePluginMessage,
} from './types/type-plugin.js';

export const createConsolePlugin = (options?: ConsoleOptions) => {
  const newOptions = mergeConsoleOptions(options);
  return definePlugin<ConsolePluginContext, ConsolePluginMessage>({
    name: 'console',
    execute: async ({ ctx, priority, message, pipe }) => {
      await pipe(
        () => {
          return assertMessage(message);
        },
        (message) => {
          return formatMessage(ctx, priority, message, newOptions);
        },
        (message) => {
          console.log(message);
        }
      )();
    },
  });
};
