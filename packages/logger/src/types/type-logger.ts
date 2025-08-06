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
 * Check if a type has any required properties.
 * @template T The type to check.
 * @returns true if the type has required properties, false otherwise.
 */
export type HasRequiredProperties<T> = T extends object
  ? {
      [K in keyof T]-?: object extends Pick<T, K> ? never : K;
    }[keyof T] extends never
    ? false
    : true
  : false;

/**
 * Setup context type that makes InitialContext optional while keeping PluginContext unchanged.
 * @template InitialContext The initial context type.
 * @template PluginContext The plugin context type.
 * @returns The setup context type with optional InitialContext.
 */
export type SetupContext<
  InitialContext extends object,
  PluginContext extends object,
> = Partial<InitialContext> & PluginContext;

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
  | SetupContext<InitialContext, PluginContext>
  | Promise<SetupContext<InitialContext, PluginContext>>;

/**
 * Logger Builder interface for when PluginContext has required properties.
 * @template InitialContext The initial context type.
 * @template PluginContext The plugin context type.
 * @returns The LoggerBuilder type.
 */
export interface LoggerBuilderWithRequired<
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
   * Build the logger with a setup function.
   * @param setup The setup function.
   * @returns The Logger type.
   */
  build(
    setup: StrictSetupFunction<InitialContext, PluginContext>
  ): Logger<MergedLoggerContext<InitialContext, PluginContext>>;

  /**
   * Build the logger with a Promise parameters.
   * @param setup The setup function.
   * @returns The Logger type.
   */
  build(
    setup: Promise<SetupContext<InitialContext, PluginContext>>
  ): Logger<MergedLoggerContext<InitialContext, PluginContext>>;

  /**
   *  Build the logger with a context object.
   * @param setup The setup context object.
   * @returns The Logger type.
   */
  build(
    setup: SetupContext<InitialContext, PluginContext>
  ): Logger<MergedLoggerContext<InitialContext, PluginContext>>;
}

/**
 * Logger Builder interface for when PluginContext has no required properties.
 * @template InitialContext The initial context type.
 * @template PluginContext The plugin context type.
 * @returns The LoggerBuilder type.
 */
export interface LoggerBuilderNoRequired<
  InitialContext extends object = object,
  PluginContext extends object = object,
> {
  /**
   * Build the logger without parameters.
   * @returns The Logger type.
   */
  build(): Logger<MergedLoggerContext<InitialContext, PluginContext>>;
}

/**
 * Logger Builder interface - conditional based on PluginContext requirements.
 * @template InitialContext The initial context type.
 * @template PluginContext The plugin context type.
 * @returns The LoggerBuilder type.
 */
export type LoggerBuilder<
  InitialContext extends object = object,
  PluginContext extends object = object,
> =
  HasRequiredProperties<PluginContext> extends false
    ? LoggerBuilderNoRequired<InitialContext, PluginContext> &
        LoggerBuilderWithRequired<InitialContext, PluginContext>
    : LoggerBuilderWithRequired<InitialContext, PluginContext>;

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
  debug: (message: RawLoggerMessage<Context>) => Promise<void>;
  /**
   * Info log method.
   * @param message The message to log.
   * @returns void.
   */
  info: (message: RawLoggerMessage<Context>) => Promise<void>;
  /**
   * Warn log method.
   * @param message The message to log.
   * @returns void.
   */
  warn: (message: RawLoggerMessage<Context>) => Promise<void>;
  /**
   * Error log method.
   * @param message The message to log.
   * @returns void.
   */
  error: (message: RawLoggerMessage<Context>) => Promise<void>;
  /**
   * Verbose log method.
   * @param message The message to log.
   * @returns void.
   */
  verbose: (message: RawLoggerMessage<Context>) => Promise<void>;
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
