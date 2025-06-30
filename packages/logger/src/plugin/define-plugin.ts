import type { LoggerContext } from '../types/type-logger-builder.js';
import type { LoggerMessage, LoggerPlugin } from '../types/type-plugin.js';

type DefineConfigFn = <
  Context extends LoggerContext = LoggerContext,
  Message extends LoggerMessage = LoggerMessage,
>(
  plugin: LoggerPlugin<Context, Message>
) => LoggerPlugin<Context, Message>;

// Helper function to define a plugin, simply returns the provided plugin configuration object
export const definePlugin: DefineConfigFn = (plugin) => {
  return plugin;
};
