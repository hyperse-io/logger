import type { LogLevel } from '../constant/log-level.js';
import type { LoggerPlugin } from './type-logger-plugin.js';
import type { RawLoggerMessage } from './type-message.js';

export type LoggerContext<Context extends object = object> = Context & {
  name: string;
  thresholdLevel: LogLevel;
};

// 从 LoggerPlugin 中提取 Context 类型
export type ExtractPluginContext<T> =
  T extends LoggerPlugin<infer Context> ? Context : never;

// 从多个 Plugin 中提取并合并 Context 类型
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

// 完整的 Context 类型 - 基于现有的 LoggerContext
export type MergedLoggerContext<
  InitialContext extends object,
  PluginContext extends object = object,
> = LoggerContext<InitialContext & PluginContext>;

// 严格的部分类型 - 只允许已知的属性，不允许额外属性
export type StrictPartial<T> = {
  [K in keyof T]?: T[K];
};

// 确保对象只包含指定的属性，不允许额外属性
export type Exact<T, U> = T extends U ? (U extends T ? T : never) : never;

// 更严格的类型 - 确保只接受已知的属性
export type ValidSetupContext<
  InitialContext extends object,
  PluginContext extends object,
> = Exact<
  Partial<MergedLoggerContext<InitialContext, PluginContext>>,
  Partial<MergedLoggerContext<InitialContext, PluginContext>>
>;

// 严格限制函数返回值的类型
export type StrictSetupFunction<
  InitialContext extends object,
  PluginContext extends object,
> = () =>
  | ValidSetupContext<InitialContext, PluginContext>
  | Promise<ValidSetupContext<InitialContext, PluginContext>>;

// Logger Builder 接口
export interface LoggerBuilder<
  InitialContext extends object = object,
  PluginContext extends object = object,
> {
  // 支持单个 plugin
  use<Plugin extends LoggerPlugin<any>>(
    plugin: Plugin
  ): LoggerBuilder<
    InitialContext,
    PluginContext & ExtractPluginContext<Plugin>
  >;

  // 支持多个 plugin
  use<Plugins extends readonly LoggerPlugin<any>[]>(
    ...plugins: Plugins
  ): LoggerBuilder<
    InitialContext,
    PluginContext & ExtractPluginsContext<Plugins>
  >;

  // build 方法重载 - 无参数
  build(): Logger<MergedLoggerContext<InitialContext, PluginContext>>;

  // build 方法重载 - 对象参数
  build(
    setup: Partial<MergedLoggerContext<InitialContext, PluginContext>>
  ): Logger<MergedLoggerContext<InitialContext, PluginContext>>;

  // build 方法重载 - Promise 参数
  build(
    setup: Promise<Partial<MergedLoggerContext<InitialContext, PluginContext>>>
  ): Logger<MergedLoggerContext<InitialContext, PluginContext>>;

  // build 方法重载 - 函数参数
  build(
    setup: () =>
      | Partial<MergedLoggerContext<InitialContext, PluginContext>>
      | Promise<Partial<MergedLoggerContext<InitialContext, PluginContext>>>
  ): Logger<MergedLoggerContext<InitialContext, PluginContext>>;
}

// 最终的 Logger 类型 - 确保 Context 包含完整的 plugin context
export interface Logger<Context extends LoggerContext = LoggerContext> {
  debug: (message: RawLoggerMessage<Context>) => void;
  info: (message: RawLoggerMessage<Context>) => void;
  warn: (message: RawLoggerMessage<Context>) => void;
  error: (message: RawLoggerMessage<Context>) => void;
  verbose: (message: RawLoggerMessage<Context>) => void;
}

// 创建 Logger 的工厂函数类型
export interface CreateLoggerFactory {
  <InitialContext extends object = object>(
    options?: LoggerContext<InitialContext> & {
      errorHandling?: (error: Error) => void;
    }
  ): LoggerBuilder<InitialContext, object>;
}
