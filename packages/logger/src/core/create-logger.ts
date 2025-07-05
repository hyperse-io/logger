import type { LoggerPlugin } from '../types/index.js';
import type { LoggerContext } from '../types/type-logger.js';
import type {
  CreateLoggerFactory,
  ExtractPluginContext,
  ExtractPluginsContext,
  Logger,
  LoggerBuilder,
  MergedLoggerContext,
  StrictSetupFunction,
  ValidSetupContext,
} from '../types/type-logger.js';
import { Logger as LoggerImpl } from './logger.js';

/**
 * LoggerBuilderImpl is a class that implements the LoggerBuilder interface.
 * It is used to create a new logger instance with the given plugins.
 * @template InitialContext The initial context type
 * @template PluginContext The plugin context type
 */
class LoggerBuilderImpl<
  InitialContext extends object = object,
  PluginContext extends object = object,
> implements LoggerBuilder<InitialContext, PluginContext>
{
  private logger: LoggerImpl<
    MergedLoggerContext<InitialContext, PluginContext>
  >;
  private plugins: LoggerPlugin<any>[] = [];

  constructor(
    logger: LoggerImpl<MergedLoggerContext<InitialContext, PluginContext>>,
    plugins: LoggerPlugin<any>[] = []
  ) {
    this.logger = logger;
    this.plugins = plugins;
  }

  /**
   * Use a single plugin
   * @param plugin The plugin to use
   * @returns A new LoggerBuilder instance
   */
  use<Plugin extends LoggerPlugin<any>>(
    plugin: Plugin
  ): LoggerBuilder<
    InitialContext,
    PluginContext & ExtractPluginContext<Plugin>
  >;

  /**
   * Use multiple plugins
   * @param plugins The plugins to use
   * @returns A new LoggerBuilder instance
   */
  use<Plugins extends readonly LoggerPlugin<any>[]>(
    ...plugins: Plugins
  ): LoggerBuilder<
    InitialContext,
    PluginContext & ExtractPluginsContext<Plugins>
  >;

  /**
   * Use multiple plugins
   * @param plugins The plugins to use
   * @returns A new LoggerBuilder instance
   */
  use(...plugins: LoggerPlugin<any>[]): any {
    this.plugins.push(...plugins);
    this.logger.use(...plugins);
    return new LoggerBuilderImpl(this.logger, this.plugins);
  }

  /**
   * Build a new logger instance
   * @returns A new logger instance
   */
  build(): Logger<MergedLoggerContext<InitialContext, PluginContext>>;

  /**
   * Build a new logger instance with a setup function
   * @param setup The setup function to use
   * @returns A new logger instance
   */
  build(
    setup: ValidSetupContext<InitialContext, PluginContext>
  ): Logger<MergedLoggerContext<InitialContext, PluginContext>>;

  /**
   * Build a new logger instance with a setup function
   * @param setup The setup function to use
   * @returns A new logger instance
   */
  build(
    setup: Promise<ValidSetupContext<InitialContext, PluginContext>>
  ): Logger<MergedLoggerContext<InitialContext, PluginContext>>;

  /**
   * Build a new logger instance with a setup function
   * @param setup The setup function to use
   * @returns A new logger instance
   */
  build(
    setup: StrictSetupFunction<InitialContext, PluginContext>
  ): Logger<MergedLoggerContext<InitialContext, PluginContext>>;

  /**
   * Build a new logger instance with a setup function
   * @param setup The setup function to use
   * @returns A new logger instance
   */
  build(
    setup?:
      | ValidSetupContext<InitialContext, PluginContext>
      | Promise<ValidSetupContext<InitialContext, PluginContext>>
      | StrictSetupFunction<InitialContext, PluginContext>
  ): Logger<MergedLoggerContext<InitialContext, PluginContext>> {
    if (setup) {
      const currentCtx = this.logger.getContext();
      const currentErrorHandling = this.logger.getErrorHandling();
      const newLogger = new LoggerImpl<
        MergedLoggerContext<InitialContext, PluginContext>
      >({
        ...currentCtx,
        errorHandling: currentErrorHandling,
        setup: typeof setup === 'function' ? setup : () => setup,
      } as MergedLoggerContext<InitialContext, PluginContext>);

      newLogger.use(...this.plugins);

      return newLogger.build();
    } else {
      return this.logger.build();
    }
  }
}

/**
 * createLogger is a factory function that creates a new logger instance.
 * @param options The options for the logger
 * @returns A new logger instance
 */
export const createLogger: CreateLoggerFactory = <
  InitialContext extends object = object,
>(
  options?: LoggerContext<InitialContext> & {
    errorHandling?: (error: Error) => void;
  }
): LoggerBuilder<InitialContext, object> => {
  const logger = new LoggerImpl<MergedLoggerContext<InitialContext>>(options);
  return new LoggerBuilderImpl(logger);
};
