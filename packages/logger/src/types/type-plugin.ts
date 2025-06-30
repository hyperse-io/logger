import type { LogLevel } from '../constant/log-level.js';
import type { LoggerContext } from './type-logger-builder.js';

export type LoggerMessage = {
  message: string | object;
  name?: string;
  stack?: string | undefined | null;
};

export type LoggerPluginContext<Context extends LoggerContext> = Context & {
  pluginName: string;
};

export interface LoggerPlugin<
  Context extends LoggerContext,
  Message extends LoggerMessage,
> {
  name: string;
  setup(
    ctx: LoggerPluginContext<Context>,
    priority: LogLevel,
    message: Message
  ): void | Promise<void>;
}
