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
import { isFunction } from '../helpers/helper-is-function.js';
import { mergeOptions } from '../helpers/helper-merge-options.js';
import { simpleDeepClone } from '../helpers/helper-simple-deep-clone.js';
import type { LoggerContext } from '../types/type-logger.js';
import type { LoggerPlugin } from '../types/type-logger-plugin.js';
import type { LoggerMessage, RawLoggerMessage } from '../types/type-message.js';
import type { DeepPartial } from '../types/type-partial-deep.js';

/**
 * Logger is a class for constructing customizable loggers.
 * It supports a plugin mechanism, allowing flexible extension of the logging process,
 * including custom log levels, formatting, and output handling.
 * Plugins can be added via the chainable use() method, and the final logger instance
 * is created with the build() method.
 * @template Context The logger context type, including log level, name, etc.
 */
export class Logger<Context extends LoggerContext = LoggerContext>
  implements Logger<Context>
{
  private ctx: Context;
  private errorHandling: ((error: Error) => void) | undefined;
  private pipeline: Pipeline<{
    ctx: Context;
    message: RawLoggerMessage<Context>;
    level: LogLevel;
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
      thresholdLevel: defaultLogLevel,
    } as Context;
    this.ctx = mergeOptions<Context>(defaultCtx, {
      ...(ctx || {}),
    });
    this.errorHandling = errorHandling;

    if (setup) {
      this.useSetupCtx(setup);
    }

    this.useMessageParser();
  }

  private useSetupCtx = async (
    setup: () => DeepPartial<Context> | Promise<DeepPartial<Context>>
  ) => {
    this.pipeline.use(async (ctx, next) => {
      const dynamicCtx = await executeFunction(setup);
      ctx.ctx = mergeOptions(ctx.ctx, dynamicCtx || {});
      await next();
    });
  };

  /**
   * Add message parsing middleware to the pipeline
   * Parse RawLoggerMessage to LoggerMessage
   */
  private useMessageParser() {
    this.pipeline.use(async (ctx, next) => {
      const { message: rawMessage, ctx: pluginCtx } = ctx;

      if (!rawMessage) {
        await next();
        return;
      }

      try {
        let parsedMessage: LoggerMessage;
        if (isFunction(rawMessage)) {
          parsedMessage = rawMessage(pluginCtx);
        } else {
          parsedMessage = rawMessage;
        }

        ctx.message = parsedMessage as LoggerMessage;
        await next();
      } catch (err: any) {
        await next(err);
      }
    });
  }

  /**
   * Registers Logger plugins into the logging pipeline.
   * @param plugins LoggerPlugin instances to be used in the pipeline
   * @returns this, for chaining
   */
  public use(...plugins: LoggerPlugin<Context>[]): this {
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
          message: message as LoggerMessage,
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
    Logger<Context>,
    'debug' | 'info' | 'warn' | 'error' | 'verbose'
  > {
    this.pipeline.use(async (_, next, error) => {
      if (error) {
        await executeFunction(this.errorHandling, error);
      }
      await next();
    });

    // Return an object that implements the Logger interface
    return this;
  }

  /**
   * Logs a message at debug level.
   * @param message The log message
   */
  public debug(message: RawLoggerMessage<Context>) {
    this.pipeline.execute({
      ctx: this.ctx,
      message: message,
      level: LogLevel.Debug,
    });
  }

  /**
   * Logs a message at info level.
   * @param message The log message
   */
  public info(message: RawLoggerMessage<Context>) {
    this.pipeline.execute({
      ctx: this.ctx,
      message: message,
      level: LogLevel.Info,
    });
  }

  /**
   * Logs a message at warn level.
   * @param message The log message
   */
  public warn(message: RawLoggerMessage<Context>) {
    this.pipeline.execute({
      ctx: this.ctx,
      message: message,
      level: LogLevel.Warn,
    });
  }

  /**
   * Logs a message at error level.
   * @param message The log message
   */
  public error(message: RawLoggerMessage<Context>) {
    this.pipeline.execute({
      ctx: this.ctx,
      message: message,
      level: LogLevel.Error,
    });
  }

  /**
   * Logs a message at verbose level.
   * @param message The log message
   */
  public verbose(message: RawLoggerMessage<Context>) {
    this.pipeline.execute({
      ctx: this.ctx,
      message: message,
      level: LogLevel.Verbose,
    });
  }

  /**
   * Gets the current logger context
   * @returns The current logger context
   */
  public getContext(): Context {
    return this.ctx;
  }

  /**
   * Gets the error handling function
   * @returns The error handling function
   */
  public getErrorHandling(): ((error: Error) => void) | undefined {
    return this.errorHandling;
  }
}
