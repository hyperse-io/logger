import type { LogLevel } from '../constant/log-level.js';
import type { LoggerMessage, LoggerPlugin } from './type-plugin.js';

export type LoggerContext = {
  level: LogLevel;
  name: string;
};

export type LoggerPluginList<
  Context extends LoggerContext,
  Message extends LoggerMessage,
> = Array<LoggerPlugin<Context, Message>>;
