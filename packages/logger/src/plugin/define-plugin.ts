import type { LoggerMessage } from '../types/index.js';
import type { LoggerPlugin } from '../types/type-logger-plugin.js';

type DefineConfigFn = <
  Context extends object = object,
  Message extends LoggerMessage = LoggerMessage,
>(
  plugin: LoggerPlugin<Context, Message>
) => LoggerPlugin<Context, Message>;

// Helper function to define a plugin, simply returns the provided plugin configuration object
export const definePlugin: DefineConfigFn = (plugin) => {
  return plugin;
};
