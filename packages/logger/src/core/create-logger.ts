import type { DeepPartial, RawLoggerMessage } from '../types/index.js';
import type { LoggerContext } from '../types/type-logger.js';
import type { Logger as BaseLogger } from '../types/type-logger.js';
import { Logger } from './logger.js';

export const createLogger = <
  Context extends object = object,
  Message extends RawLoggerMessage<Context> = RawLoggerMessage<Context>,
>(
  options?: LoggerContext<Context> & {
    setup?: () =>
      | DeepPartial<LoggerContext<Context>>
      | Promise<DeepPartial<LoggerContext<Context>>>;
    errorHandling?: (error: Error) => void;
  }
): BaseLogger<LoggerContext<Context>, Message> => {
  return new Logger<Context, Message>(options);
};