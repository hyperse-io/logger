import { exitPipe, pipe } from '@hyperse/pipeline';
import { defaultLoggerName, defaultLogLevel } from '../constant/constant.js';
import { LogLevel } from '../constant/log-level.js';
import { createErrorLogger } from '../helpers/helper-error-logger.js';
import { executePlugins } from '../helpers/helper-execute-plugins.js';
import { formatMessage } from '../helpers/helper-format-message.js';
import { isFunction } from '../helpers/helper-is-function.js';
import type {
  LoggerContext,
  LoggerPluginList,
} from '../types/type-logger-builder.js';
import type { LoggerMessage, LoggerPlugin } from '../types/type-plugin.js';

/**
 * LoggerBuilder is a class for constructing customizable loggers.
 * It supports a plugin mechanism, allowing flexible extension of the logging process,
 * including custom log levels, formatting, and output handling.
 * Plugins can be added via the chainable use() method, and the final logger instance
 * is created with the build() method.
 *
 * @template Context The logger context type, including log level, name, etc.
 * @template Message The log message type
 */
export class LoggerBuilder<
  Context extends LoggerContext,
  Message extends LoggerMessage,
> {
  private ctx: Context;
  private pluginList: LoggerPluginList<Context, Message> = [];
  private errorPlugin: LoggerPluginList<Context, LoggerMessage>;

  constructor(context?: Omit<Context, 'name'> & { name?: string }) {
    this.ctx = {
      level: defaultLogLevel,
      name: defaultLoggerName,
      ...(context || {}),
    } as Context;
    this.errorPlugin = [createErrorLogger()];
  }

  public use(
    fun: LoggerPlugin<Context, Message> | (() => LoggerPlugin<Context, Message>)
  ) {
    this.executeUse(fun);
    return this;
  }

  public build() {
    return {
      ...this.executeLogging(),
    };
  }

  private executeUse = <Plugin extends LoggerPlugin<Context, Message>>(
    fun: Plugin | (() => Plugin)
  ) => {
    if (isFunction(fun)) {
      this.pluginList.push(fun());
    } else {
      this.pluginList.push(fun);
    }
  };

  private executeLogging = () => {
    const innerPluginList = this.pluginList;
    const innerCtx = this.ctx;
    const innerErrorLogger = this.errorPlugin;

    async function executeLog(priority: LogLevel, inputMsg: string | Message) {
      try {
        await pipe(
          () => {
            if (priority > innerCtx.level) {
              return exitPipe(false);
            }
            return true;
          },
          () => formatMessage(inputMsg),
          async ({ message }) => {
            await executePlugins(innerCtx, innerPluginList, priority, message);
          }
        )();
      } catch (error: unknown) {
        let message: LoggerMessage;
        if (error instanceof Error) {
          message = {
            name: error.name,
            message: error.message,
            stack: error.stack,
          };
        } else {
          message = {
            name: `Unknown Error`,
            message: `${error}`,
            stack: null,
          };
        }
        await executePlugins<Context, LoggerMessage>(
          innerCtx,
          innerErrorLogger,
          LogLevel.Error,
          message
        );
      }
    }

    return {
      debug: executeLog.bind(null, LogLevel.Debug),
      info: executeLog.bind(null, LogLevel.Info),
      warn: executeLog.bind(null, LogLevel.Warn),
      error: executeLog.bind(null, LogLevel.Error),
      verbose: executeLog.bind(null, LogLevel.Verbose),
    };
  };
}
