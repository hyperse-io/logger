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
import type {
  Logger as BaseLogger,
  LoggerContext,
} from '../types/type-logger.js';
import type { LoggerPlugin } from '../types/type-logger-plugin.js';
import type { LoggerMessage, RawLoggerMessage } from '../types/type-message.js';
import type { DeepPartial } from '../types/type-partial-deep.js';

/**
 * Logger is a class for constructing customizable loggers.
 * It supports a plugin mechanism, allowing flexible extension of the logging process,
 * including custom log levels, formatting, and output handling.
 * Plugins can be added via the chainable use() method, and the final logger instance
 * is created with the build() method.
 *
 * @template Context The logger context type, including log level, name, etc.
 * @template RawMessage The log message type
 */
export class Logger<
  Context extends object = object,
  Message extends RawLoggerMessage<Context> = RawLoggerMessage<Context>,
> implements BaseLogger<LoggerContext<Context>, Message>
{
  private ctx: LoggerContext<Context>;
  private errorHandling: ((error: Error) => void) | undefined;
  private pipeline: Pipeline<{
    ctx: LoggerContext<Context>;
    rawMessage: Message;
    message?: LoggerMessage;
    level: LogLevel;
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
      thresholdLevel: defaultLogLevel,
    } as LoggerContext<Context>;
    this.ctx = mergeOptions<LoggerContext<Context>>(defaultCtx, {
      ...(ctx || {}),
    });
    this.errorHandling = errorHandling;
    this.useSetupCtx(setup);
    this.useMessageParser();
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

  /**
   * Registers message parser pipeline
   */
  private useMessageParser() {
    this.pipeline.use(async (ctx, next) => {
      const rawMessage = ctx.rawMessage as Message;
      ctx.message = this.parseMessage(rawMessage, ctx.ctx);
      await next();
    });
  }

  /**
   * Registers a Logger plugin into the logging pipeline.
   * @param plugins LoggerPlugin instances to be used in the pipeline
   * @returns this, for chaining
   */
  public use(
    ...plugins: LoggerPlugin<LoggerContext<Context>, LoggerMessage>[]
  ): Pick<BaseLogger<LoggerContext<Context>, Message>, 'use' | 'build'> {
    for (const plugin of plugins) {
      this.pipeline.use(async (ctx, next) => {
        const { level, message, ctx: pluginCtx } = ctx;
        if (!message) {
          await next();
          return;
        }
        const options = {
          ctx: { ...simpleDeepClone(pluginCtx), pluginName: plugin.pluginName },
          level: level,
          message: message,
          pipe: pipe,
          exitPipe: exitPipe,
          pipeContext: pipeContext,
          isExitPipeValue: isExitPipeValue,
        };
        await plugin.execute(options);
        await next();
      });
    }
    return this;
  }

  /**
   * Builds the Logger and returns an object with common logging methods
   * (debug, info, warn, error, verbose). Also registers error handling logic
   * at the end of the pipeline.
   * @returns An object containing only the logging methods
   */
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

  /**
   * Logs a message at debug level.
   * @param message The log message
   */
  public debug(message: Message) {
    this.pipeline.execute({
      ctx: this.ctx,
      rawMessage: message,
      level: LogLevel.Debug,
    });
  }

  /**
   * Logs a message at info level.
   * @param message The log message
   */
  public info(message: Message) {
    this.pipeline.execute({
      ctx: this.ctx,
      rawMessage: message,
      level: LogLevel.Info,
    });
  }

  /**
   * Logs a message at warn level.
   * @param message The log message
   */
  public warn(message: Message) {
    this.pipeline.execute({
      ctx: this.ctx,
      rawMessage: message,
      level: LogLevel.Warn,
    });
  }

  /**
   * Logs a message at error level.
   * @param message The log message
   */
  public error(message: Message) {
    this.pipeline.execute({
      ctx: this.ctx,
      rawMessage: message,
      level: LogLevel.Error,
    });
  }

  /**
   * Logs a message at verbose level.
   * @param message The log message
   */
  public verbose(message: Message) {
    this.pipeline.execute({
      ctx: this.ctx,
      rawMessage: message,
      level: LogLevel.Verbose,
    });
  }

  /**
   * The log message, which can be a function or a static message.
   * If it's a function, it will be executed with the current context.
   * @param message The log message to be parsed.
   * @returns message The parsed log message.
   */
  private parseMessage(
    message: Message,
    ctx: LoggerContext<Context>
  ): LoggerMessage {
    try {
      if (typeof message === 'function') {
        return message(ctx);
      }
      return message;
    } catch (err: any) {
      if (typeof message === 'function') {
        return {
          message: '消息函数执行失败',
          stack: err?.stack,
        };
      } else if (typeof message === 'object') {
        return {
          ...message,
        };
      } else {
        return message;
      }
    }
  }
}
