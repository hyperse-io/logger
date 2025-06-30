import type { LogLevel } from '../constant/log-level.js';
import type {
  LoggerContext,
  LoggerPluginList,
} from '../types/type-logger-builder.js';
import type {
  LoggerMessage,
  LoggerPluginContext,
} from '../types/type-plugin.js';

export const executePlugins = async <
  Context extends LoggerContext,
  Message extends LoggerMessage,
>(
  ctx: Context,
  pluginList: LoggerPluginList<Context, Message>,
  priority: LogLevel,
  message: Message
): Promise<void> => {
  for (const plugin of pluginList) {
    const pluginCtx: LoggerPluginContext<Context> = {
      ...ctx,
      pluginName: plugin.name,
    };
    await plugin.setup(pluginCtx, priority, message);
  }
};
