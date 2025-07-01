import type { DeepPartial, LoggerMessage } from '@hyperse/logger-common';
import type { LoggerContext } from '../types/type-logger.js';
import { Logger } from './logger.js';

export const createLogger = <
  Context extends LoggerContext = LoggerContext,
  Message extends LoggerMessage = LoggerMessage,
>(
  options?: Context & {
    setup?: () => DeepPartial<Context> | Promise<DeepPartial<Context>>;
    errorHandling?: (error: Error) => void;
  }
) => {
  return new Logger<Context, Message>(options);
};
