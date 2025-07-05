import type { LoggerContext } from './type-logger.js';

export type LoggerMessageObject = {
  message: string | object;
  prefix?: string;
  name?: string;
  stack?: string | undefined | null;
};

export type LoggerMessage = string | LoggerMessageObject;

export type RawLoggerMessage<Context extends object = object> =
  | LoggerMessage
  | ((ctx: LoggerContext<Context>) => LoggerMessage);
