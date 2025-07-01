import { definePlugin } from '@hyperse/logger';
import { assertMessage } from './helpers/helper-assert-message.js';
import { formatMessage } from './helpers/helper-format-message.js';
import { isLoggable } from './helpers/helper-is-loggable.js';
import { mergeConsoleOptions } from './helpers/helper-merge-optons.js';
import type { ConsoleOptions } from './types/type-options.js';
import type {
  ConsolePluginContext,
  ConsolePluginMessage,
} from './types/type-plugin.js';

export const createConsolePlugin = (options?: ConsoleOptions) => {
  const newOptions = mergeConsoleOptions(options);
  return definePlugin<ConsolePluginContext, ConsolePluginMessage | string>({
    name: 'hps-logger-plugin-console',
    execute: async ({ ctx, priority, message, pipe, exitPipe }) => {
      await pipe(
        () => {
          if (!isLoggable(ctx, priority)) {
            return exitPipe('priority is too low');
          }
          return;
        },
        () => {
          //ensure message is object
          return {
            inputMessage: assertMessage(message),
          };
        },
        ({ inputMessage }) => {
          const formatOptions = {
            ctx,
            priority,
            inputMessage,
            options: newOptions,
          };
          const outputMessage = formatMessage(formatOptions);
          return {
            outputMessage,
          };
        },
        ({ outputMessage }) => {
          console.log(outputMessage);
        }
      )();
    },
  });
};
