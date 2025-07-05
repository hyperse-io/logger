import type { LogLevel } from '../constant/log-level.js';
import type { LoggerPlugin } from './type-logger-plugin.js';
import type { RawLoggerMessage } from './type-message.js';

/**
 * The context type for the logger.
 * @template Context The context type for the logger.
 */
export type LoggerContext<Context extends object = object> = Context & {
  name: string;
  thresholdLevel: LogLevel;
};

/**
 * Extract the context type from a LoggerPlugin.
 * @template T The type of the LoggerPlugin.
 * @returns The context type of the LoggerPlugin.
 */
export type ExtractPluginContext<T> =
  T extends LoggerPlugin<infer Context> ? Context : never;

/**
 * Extract and merge the context type from multiple plugins.
 * @template T The type of the LoggerPlugin.
 * @returns The context type of the LoggerPlugin.
 */
export type ExtractPluginsContext<T extends readonly LoggerPlugin<any>[]> =
  T extends readonly [infer First, ...infer Rest]
    ? First extends LoggerPlugin<any>
      ? Rest extends readonly LoggerPlugin<any>[]
        ? ExtractPluginContext<First> & ExtractPluginsContext<Rest>
        : ExtractPluginContext<First>
      : Rest extends readonly LoggerPlugin<any>[]
        ? ExtractPluginsContext<Rest>
        : object
    : object;

/**
 * The complete Context type - based on the existing LoggerContext.
 * @template InitialContext The initial context type.
 * @template PluginContext The plugin context type.
 * @returns The complete context type.
 */
export type MergedLoggerContext<
  InitialContext extends object,
  PluginContext extends object = object,
> = LoggerContext<InitialContext & PluginContext>;

/**
 * Strict partial type - only allows known properties, no extra properties.
 * @template T The type to make strict partial.
 * @returns The strict partial type.
 */
export type StrictPartial<T> = {
  [K in keyof T]?: T[K];
};

/**
 * Ensure the object only contains the specified properties, no extra properties.
 * @template T The type to make exact.
 * @template U The type to make exact.
 * @returns The exact type.
 */
export type Exact<T, U> = T extends U ? (U extends T ? T : never) : never;

/**
 * More strict type - only accepts known properties.
 * @template InitialContext The initial context type.
 * @template PluginContext The plugin context type.
 * @returns The valid setup context type.
 */
export type ValidSetupContext<
  InitialContext extends object,
  PluginContext extends object,
> = Exact<
  Partial<MergedLoggerContext<InitialContext, PluginContext>>,
  Partial<MergedLoggerContext<InitialContext, PluginContext>>
>;

/**
 * Strictly limit the return type of the function.
 * @template InitialContext The initial context type.
 * @template PluginContext The plugin context type.
 * @returns The strict setup function type.
 */
export type StrictSetupFunction<
  InitialContext extends object,
  PluginContext extends object,
> = () =>
  | ValidSetupContext<InitialContext, PluginContext>
  | Promise<ValidSetupContext<InitialContext, PluginContext>>;

/**
 * Logger Builder interface.
 * @template InitialContext The initial context type.
 * @template PluginContext The plugin context type.
 * @returns The LoggerBuilder type.
 */
export interface LoggerBuilder<
  InitialContext extends object = object,
  PluginContext extends object = object,
> {
  /**
   * Use a single plugin.
   * @param plugin The plugin to use.
   * @returns The LoggerBuilder type.
   */
  use<Plugin extends LoggerPlugin<any>>(
    plugin: Plugin
  ): LoggerBuilder<
    InitialContext,
    PluginContext & ExtractPluginContext<Plugin>
  >;

  /**
   * Use multiple plugins.
   * @param plugins The plugins to use.
   * @returns The LoggerBuilder type.
   */
  use<Plugins extends readonly LoggerPlugin<any>[]>(
    ...plugins: Plugins
  ): LoggerBuilder<
    InitialContext,
    PluginContext & ExtractPluginsContext<Plugins>
  >;

  /**
   * Build the logger.
   * @returns The Logger type.
   */
  build(): Logger<MergedLoggerContext<InitialContext, PluginContext>>;

  /**
   * Build the logger with a setup function.
   * @param setup The setup function.
   * @returns The Logger type.
   */
  build(
    setup: Partial<MergedLoggerContext<InitialContext, PluginContext>>
  ): Logger<MergedLoggerContext<InitialContext, PluginContext>>;

  /**
   * Build the logger with a Promise parameters.
   * @param setup The setup function.
   * @returns The Logger type.
   */
  build(
    setup: Promise<Partial<MergedLoggerContext<InitialContext, PluginContext>>>
  ): Logger<MergedLoggerContext<InitialContext, PluginContext>>;

  /**
   * Build the logger with a function parameters.
   * @param setup The setup function.
   * @returns The Logger type.
   */
  build(
    setup: () =>
      | Partial<MergedLoggerContext<InitialContext, PluginContext>>
      | Promise<Partial<MergedLoggerContext<InitialContext, PluginContext>>>
  ): Logger<MergedLoggerContext<InitialContext, PluginContext>>;
}

/**
 * The final Logger type - ensure Context contains the complete plugin context.
 * @template Context The context type for the logger.
 * @returns The Logger type.
 */
export interface Logger<Context extends LoggerContext = LoggerContext> {
  /**
   * Debug log method.
   * @param message The message to log.
   * @returns void.
   */
  debug: (message: RawLoggerMessage<Context>) => void;
  /**
   * Info log method.
   * @param message The message to log.
   * @returns void.
   */
  info: (message: RawLoggerMessage<Context>) => void;
  /**
   * Warn log method.
   * @param message The message to log.
   * @returns void.
   */
  warn: (message: RawLoggerMessage<Context>) => void;
  /**
   * Error log method.
   * @param message The message to log.
   * @returns void.
   */
  error: (message: RawLoggerMessage<Context>) => void;
  /**
   * Verbose log method.
   * @param message The message to log.
   * @returns void.
   */
  verbose: (message: RawLoggerMessage<Context>) => void;
}

/**
 * The factory function type for creating Logger.
 * @returns The CreateLoggerFactory type.
 */
export interface CreateLoggerFactory {
  <InitialContext extends object = object>(
    options?: LoggerContext<InitialContext> & {
      errorHandling?: (error: Error) => void;
    }
  ): LoggerBuilder<InitialContext, object>;
}
