import type { DeepPartial, LoggerMessage } from '../types/index.js';
import type { LoggerContext } from '../types/type-logger.js';
import { Logger } from './logger.js';

export const createLogger = <
  Context extends object = object,
  Message extends LoggerMessage = LoggerMessage,
>(
  options?: LoggerContext<Context> & {
    setup?: () =>
      | DeepPartial<LoggerContext<Context>>
      | Promise<DeepPartial<LoggerContext<Context>>>;
    errorHandling?: (error: Error) => void;
  }
) => {
  return new Logger<Context, Message>(options);
};
