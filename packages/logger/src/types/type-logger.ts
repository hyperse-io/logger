import type { LogLevel } from '../constant/log-level.js';
import type { LoggerPlugin } from './type-logger-plugin.js';
import type { RawLoggerMessage } from './type-message.js';

export type LoggerContext<Context extends object = object> = Context & {
  name: string;
  thresholdLevel: LogLevel;
};

export interface Logger<
  Context extends LoggerContext = LoggerContext,
  Message extends RawLoggerMessage<Context> = RawLoggerMessage<Context>,
> {
  use: (
    ...plugins: LoggerPlugin<Context>[]
  ) => Pick<Logger<Context, Message>, 'use' | 'build'>;
  build: () => Pick<
    Logger<Context, Message>,
    'debug' | 'info' | 'warn' | 'error' | 'verbose'
  >;
  debug: (message: Message) => void;
  info: (message: Message) => void;
  warn: (message: Message) => void;
  error: (message: Message) => void;
  verbose: (message: Message) => void;
}
