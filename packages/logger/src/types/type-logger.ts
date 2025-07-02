import type { LogLevel } from '../constant/log-level.js';
import type { LoggerPlugin } from './type-logger-plugin.js';
import type { LoggerMessage } from './type-message.js';

export type LoggerContext<Context extends object = object> = Context & {
  name: string;
  thresholdLevel: LogLevel;
};

export type LoggerPluginList<
  Context extends LoggerContext,
  Message extends LoggerMessage,
> = Array<LoggerPlugin<Context, Message>>;

export interface Logger<
  Context extends LoggerContext = LoggerContext,
  Message extends LoggerMessage = LoggerMessage,
> {
  use: (
    ...plugins: LoggerPlugin<Context, Message>[]
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
