import { definePlugin, type LoggerPlugin } from '@hyperse/logger';
import { assertMessage } from './helpers/helper-assert-message.js';
import { formatMessage } from './helpers/helper-format-message.js';
import { isLoggable } from './helpers/helper-is-loggable.js';
import { mergeConsoleOptions } from './helpers/helper-merge-options.js';
import type { ConsoleOptions } from './types/type-options.js';
import type { ConsolePluginContext } from './types/type-plugin.js';

/**
 * Creates a new logger plugin that outputs formatted log messages to the console.
 *
 * @param options - Optional configuration options for the plugin.
 * @returns A new logger plugin that outputs formatted log messages to the console.
 */
export const createConsolePlugin = (
  options?: ConsoleOptions
): LoggerPlugin<ConsolePluginContext> => {
  const newOptions = mergeConsoleOptions(options);
  return definePlugin<ConsolePluginContext>({
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
