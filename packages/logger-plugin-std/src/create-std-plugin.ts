import { definePlugin } from '@hyperse/logger';
import { assertMessage } from './helpers/helper-assert-message.js';
import { formatMessage } from './helpers/helper-format-message.js';
import { isLoggable } from './helpers/helper-is-loggable.js';
import { mergeStdOptions } from './helpers/helper-merge-options.js';
import type { StdOptions } from './types/type-options.js';
import type {
  StdPluginContext,
  StdPluginMessage,
} from './types/type-plugin.js';

export const createStdPlugin = (options?: StdOptions) => {
  const newOptions = mergeStdOptions(options);
  return definePlugin<StdPluginContext, StdPluginMessage | string>({
    pluginName: 'hps-logger-plugin-std',
    execute: async ({ ctx, level, message, pipe, exitPipe }) => {
      await pipe(
        () => {
          // Check if we're in a Node.js environment
          if (
            typeof process === 'undefined' ||
            typeof process.stdout === 'undefined'
          ) {
            return exitPipe('This plugin requires Node.js environment');
          }
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
          process.stdout.write(outputMessage);
        }
      )();
    },
  });
};
