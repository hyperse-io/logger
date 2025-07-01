import type { LoggerMessage } from '@hyperse/logger-common';
import type { LogLevel } from '@hyperse/logger-common';
import type { LoggerPlugin } from './type-logger-plugin.js';

export type LoggerContext = {
  name: string;
  level: LogLevel;
};

export type LoggerPluginList<
  Context extends LoggerContext,
  Message extends LoggerMessage,
> = Array<LoggerPlugin<Context, Message>>;

export interface BaseLogger<
  Context extends LoggerContext,
  Message extends LoggerMessage,
> {
  use: (plugin: LoggerPlugin<Context, Message>) => BaseLogger<Context, Message>;
  build: () => Pick<
    BaseLogger<Context, Message>,
    'debug' | 'info' | 'warn' | 'error' | 'verbose'
  >;
  debug: (message: Message) => void;
  info: (message: Message) => void;
  warn: (message: Message) => void;
  error: (message: Message) => void;
  verbose: (message: Message) => void;
}
