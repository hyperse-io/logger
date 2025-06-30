import type { LoggerContext } from '../types/type-logger-builder.js';
import type { LoggerMessage } from '../types/type-plugin.js';
import { LoggerBuilder } from './logger-builder.js';

export const createLogger = <
  Context extends LoggerContext = LoggerContext,
  Message extends LoggerMessage = LoggerMessage,
>(
  context?: Omit<Context, 'name'> & { name?: string }
): LoggerBuilder<Context, Message> => {
  return new LoggerBuilder<Context, Message>(context);
};
