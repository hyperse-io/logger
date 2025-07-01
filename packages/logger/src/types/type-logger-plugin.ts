import type { LoggerMessage, LogLevel } from '@hyperse/logger-common';
import type { pipe } from '@hyperse/pipeline';
import type { LoggerContext } from './type-logger.js';

export type LoggerPluginContext<Context extends LoggerContext> = Context & {
  pluginName: string;
};

export interface LoggerPlugin<
  Context extends LoggerContext,
  Message extends LoggerMessage,
> {
  name: string;
  execute(options: {
    ctx: LoggerPluginContext<Context>;
    pipe: typeof pipe;
    priority: LogLevel;
    message: Message;
  }): void | Promise<void>;
}
