import { definePlugin } from '@hyperse/logger';
import { assertMessage } from './helpers/helper-assert-message.js';
import { formatMessage } from './helpers/helper-format-message.js';
import { isLoggable } from './helpers/helper-is-loggable.js';
import { mergeConsoleOptions } from './helpers/helper-merge-options.js';
import type { ConsoleOptions } from './types/type-options.js';
import type {
  ConsolePluginContext,
  ConsolePluginMessage,
} from './types/type-plugin.js';

export const createConsolePlugin = (options?: ConsoleOptions) => {
  const newOptions = mergeConsoleOptions(options);
  return definePlugin<ConsolePluginContext, ConsolePluginMessage | string>({
    pluginName: 'hps-logger-plugin-console',
    execute: async ({ ctx, level, message, pipe, exitPipe }) => {
      await pipe(
        () => {
          const { disable } = newOptions;
          if (disable || !isLoggable(ctx, level)) {
            return exitPipe('This level is too low');
          }
          return {
            inputMessage: assertMessage(message),
          };
        },
        ({ inputMessage }) => {
          const formatOptions = {
            ctx,
            level,
            inputMessage,
            options: newOptions,
          };
          const outputMessage = formatMessage(formatOptions);
          return {
            outputMessage,
          };
        },
        ({ outputMessage }) => {
          console.log(...outputMessage);
        }
      )();
    },
  });
};
