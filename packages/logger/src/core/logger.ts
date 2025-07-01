import {
  type DeepPartial,
  type LoggerMessage,
  mergeOptions,
} from '@hyperse/logger-common';
import { LogLevel } from '@hyperse/logger-common';
import { pipe, Pipeline } from '@hyperse/pipeline';
import { defaultLoggerName, defaultLogLevel } from '../constant/constant.js';
import { executeFunction } from '../helpers/helper-execute-fun.js';
import type { BaseLogger, LoggerContext } from '../types/type-logger.js';
import type { LoggerPlugin } from '../types/type-logger-plugin.js';

/**
 * Logger is a class for constructing customizable loggers.
 * It supports a plugin mechanism, allowing flexible extension of the logging process,
 * including custom log levels, formatting, and output handling.
 * Plugins can be added via the chainable use() method, and the final logger instance
 * is created with the build() method.
 *
 * @template Context The logger context type, including log level, name, etc.
 * @template Message The log message type
 */
export class Logger<
  Context extends LoggerContext,
  Message extends LoggerMessage,
> implements BaseLogger<Context, Message>
{
  private ctx: Context;
  private errorHandling: ((error: Error) => void) | undefined;
  private pipeline: Pipeline<{
    ctx: Context;
    message: Message;
    priority: LogLevel;
  }> = new Pipeline();

  constructor(
    options?: Context & {
      setup?: () => DeepPartial<Context> | Promise<DeepPartial<Context>>;
      errorHandling?: (error: Error) => void;
    }
  ) {
    const { setup, errorHandling, ...ctx } = options || {};
    const defaultCtx = {
      name: defaultLoggerName,
      level: defaultLogLevel,
    } as Context;
    this.ctx = mergeOptions<Context>(defaultCtx, { ...(ctx || {}) });
    this.errorHandling = errorHandling;
    this.useSetupCtx(setup);
  }

  private useSetupCtx = async (
    setup?: () => DeepPartial<Context> | Promise<DeepPartial<Context>>
  ) => {
    this.pipeline.use(async (ctx, next) => {
      const finalCtx = await executeFunction(setup);
      ctx.ctx = mergeOptions(ctx.ctx, finalCtx || {});
      next();
    });
  };

  public use(plugin: LoggerPlugin<Context, Message>) {
    this.pipeline.use(async (ctx, next) => {
      const { priority, message, ctx: pluginCtx } = ctx;
      const options = {
        ctx: { ...pluginCtx, pluginName: plugin.name },
        priority: priority,
        message: message,
        pipe: pipe,
      };
      await plugin.execute(options);
      next();
    });
    return this;
  }

  public build(): Pick<
    BaseLogger<Context, Message>,
    'debug' | 'info' | 'warn' | 'error' | 'verbose'
  > {
    this.pipeline.use(async (_, next, error) => {
      if (error) {
        await executeFunction(this.errorHandling, error);
      }
      next();
    });
    return this;
  }

  public debug(message: Message) {
    this.pipeline.execute({
      ctx: this.ctx,
      message: message,
      priority: LogLevel.Debug,
    });
  }

  public info(message: Message) {
    this.pipeline.execute({
      ctx: this.ctx,
      message: message,
      priority: LogLevel.Info,
    });
  }

  public warn(message: Message) {
    this.pipeline.execute({
      ctx: this.ctx,
      message: message,
      priority: LogLevel.Warn,
    });
  }

  public error(message: Message) {
    this.pipeline.execute({
      ctx: this.ctx,
      message: message,
      priority: LogLevel.Error,
    });
  }

  public verbose(message: Message) {
    this.pipeline.execute({
      ctx: this.ctx,
      message: message,
      priority: LogLevel.Verbose,
    });
  }
}
