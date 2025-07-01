import {
  exitPipe,
  isExitPipeValue,
  pipe,
  pipeContext,
  Pipeline,
} from '@hyperse/pipeline';
import { defaultLoggerName, defaultLogLevel } from '../constant/constant.js';
import { LogLevel } from '../constant/log-level.js';
import { executeFunction } from '../helpers/helper-execute-fun.js';
import { mergeOptions } from '../helpers/helper-merge-options.js';
import { simpleDeepClone } from '../helpers/helper-simple-deep-clone.js';
import type { BaseLogger, LoggerContext } from '../types/type-logger.js';
import type { LoggerPlugin } from '../types/type-logger-plugin.js';
import type { LoggerMessage } from '../types/type-message.js';
import type { DeepPartial } from '../types/type-partial-deep.js';

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
  Context extends object = object,
  Message extends LoggerMessage = LoggerMessage,
> implements BaseLogger<LoggerContext<Context>, Message>
{
  private ctx: LoggerContext<Context>;
  private errorHandling: ((error: Error) => void) | undefined;
  private pipeline: Pipeline<{
    ctx: LoggerContext<Context>;
    message: Message;
    priority: LogLevel;
  }> = new Pipeline();

  constructor(
    options?: LoggerContext<Context> & {
      setup?: () =>
        | DeepPartial<LoggerContext<Context>>
        | Promise<DeepPartial<LoggerContext<Context>>>;
      errorHandling?: (error: Error) => void;
    }
  ) {
    const { setup, errorHandling, ...ctx } = options || {};
    const defaultCtx = {
      name: defaultLoggerName,
      level: defaultLogLevel,
    } as LoggerContext<Context>;
    this.ctx = mergeOptions<LoggerContext<Context>>(defaultCtx, {
      ...(ctx || {}),
    });
    this.errorHandling = errorHandling;
    this.useSetupCtx(setup);
  }

  private useSetupCtx = async (
    setup?: () =>
      | DeepPartial<LoggerContext<Context>>
      | Promise<DeepPartial<LoggerContext<Context>>>
  ) => {
    this.pipeline.use(async (ctx, next) => {
      const dynamicCtx = await executeFunction(setup);
      ctx.ctx = mergeOptions(ctx.ctx, dynamicCtx || {});
      await next();
    });
  };

  public use(plugin: LoggerPlugin<LoggerContext<Context>, Message>) {
    this.pipeline.use(async (ctx, next) => {
      const { priority, message, ctx: pluginCtx } = ctx;
      const options = {
        ctx: { ...simpleDeepClone(pluginCtx), pluginName: plugin.name },
        priority: priority,
        message: message,
        pipe: pipe,
        exitPipe: exitPipe,
        pipeContext: pipeContext,
        isExitPipeValue: isExitPipeValue,
      };
      await plugin.execute(options);
      await next();
    });
    return this;
  }

  public build(): Pick<
    BaseLogger<LoggerContext<Context>, Message>,
    'debug' | 'info' | 'warn' | 'error' | 'verbose'
  > {
    this.pipeline.use(async (_, next, error) => {
      if (error) {
        await executeFunction(this.errorHandling, error);
      }
      await next();
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
